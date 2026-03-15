import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import AccessControl "authorization/access-control";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type PersonalInfo = {
    name : Text;
    email : Text;
    phone : Text;
    location : Text;
    linkedin : Text;
    website : Text;
    jobTitle : Text;
  };

  public type WorkExperience = {
    id : Nat;
    company : Text;
    title : Text;
    location : Text;
    startDate : Text;
    endDate : ?Text;
    isCurrent : Bool;
    bullets : [Text];
  };

  public type Education = {
    id : Nat;
    institution : Text;
    degree : Text;
    field : Text;
    startDate : Text;
    endDate : Text;
    gpa : Text;
  };

  public type SkillCategory = {
    id : Nat;
    category : Text;
    skills : [Text];
  };

  public type Certification = {
    id : Nat;
    name : Text;
    issuer : Text;
    date : Text;
    url : Text;
  };

  public type Project = {
    id : Nat;
    name : Text;
    description : Text;
    url : Text;
    bullets : [Text];
  };

  public type Language = {
    id : Nat;
    language : Text;
    proficiency : Text;
  };

  public type ResumeData = {
    personalInfo : PersonalInfo;
    summary : Text;
    workExperience : [WorkExperience];
    education : [Education];
    skills : [SkillCategory];
    certifications : [Certification];
    projects : [Project];
    languages : [Language];
    targetJobDescription : Text;
  };

  // Storage
  let resumes = Map.empty<Principal, ResumeData>();
  let paidUsers = Map.empty<Principal, ()>();
  let razorpayPayments = Map.empty<Principal, Text>();
  var stripe : ?Stripe.StripeConfiguration = null;

  // Check if a given user has paid (pass caller's principal from frontend)
  public query func isPaid(user : Principal) : async Bool {
    paidUsers.containsKey(user);
  };

  // Record a Razorpay payment and mark user as paid
  // Only requires the caller to be authenticated (not anonymous)
  public shared ({ caller }) func recordRazorpayPayment(paymentId : Text) : async Bool {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be signed in to record payment");
    };
    razorpayPayments.add(caller, paymentId);
    paidUsers.add(caller, ());
    true;
  };

  public query func isStripeConfigured() : async Bool {
    stripe != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripe := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripe) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  // Confirm payment: verify session with Stripe and mark caller as paid
  public shared ({ caller }) func confirmPayment(sessionId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    let status = await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
    switch (status) {
      case (#completed({ userPrincipal })) {
        switch (userPrincipal) {
          case (?pid) {
            if (pid == caller.toText()) {
              paidUsers.add(caller, ());
              true;
            } else {
              false;
            };
          };
          case (null) {
            paidUsers.add(caller, ());
            true;
          };
        };
      };
      case (#failed(_)) { false };
    };
  };

  // Save resume - only requires sign-in and payment, no role check
  public shared ({ caller }) func saveResume(resume : ResumeData) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be signed in");
    };
    if (not paidUsers.containsKey(caller)) {
      Runtime.trap("Access denied: Please purchase to save your resume");
    };
    resumes.add(caller, resume);
  };

  public shared ({ caller }) func deleteResume() : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be signed in");
    };
    resumes.remove(caller);
  };

  public query ({ caller }) func getResume() : async ?ResumeData {
    resumes.get(caller);
  };
};
