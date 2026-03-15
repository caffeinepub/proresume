import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Trash2, User } from "lucide-react";
import { useRef } from "react";
import type { PersonalInfo } from "../../backend";

interface Props {
  value: PersonalInfo;
  onChange: (v: PersonalInfo) => void;
}

export function PersonalInfoEditor({ value, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update =
    (field: keyof PersonalInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, [field]: e.target.value });
    };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      onChange({ ...value, photoUrl: dataUrl });
    };
    reader.readAsDataURL(file);
    // reset so same file can be re-selected
    e.target.value = "";
  };

  const removePhoto = () => {
    onChange({ ...value, photoUrl: undefined });
  };

  return (
    <div className="space-y-4">
      {/* Photo Upload */}
      <div className="space-y-2">
        <Label>Profile Photo</Label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-border bg-muted flex items-center justify-center">
            {value.photoUrl ? (
              <img
                src={value.photoUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              data-ocid="personal.photo.upload_button"
              className="gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              {value.photoUrl ? "Change Photo" : "Upload Photo"}
            </Button>
            {value.photoUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removePhoto}
                data-ocid="personal.photo.delete_button"
                className="gap-1.5 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove Photo
              </Button>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Used in Photo Modern &amp; Photo Sidebar templates
        </p>
      </div>

      <p className="text-xs text-muted-foreground">
        Fields marked <span className="text-destructive">*</span> are required
        for a complete ATS profile.
      </p>

      <div className="space-y-1.5">
        <Label htmlFor="pi-name">
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="pi-name"
          value={value.name}
          onChange={update("name")}
          placeholder="Alexandra Chen"
          data-ocid="personal.name.input"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pi-jobTitle">Professional Title</Label>
        <Input
          id="pi-jobTitle"
          value={value.jobTitle}
          onChange={update("jobTitle")}
          placeholder="Senior Product Manager"
          data-ocid="personal.input"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="pi-email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pi-email"
            type="email"
            value={value.email}
            onChange={update("email")}
            placeholder="you@email.com"
            data-ocid="personal.email.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pi-phone">
            Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pi-phone"
            type="tel"
            value={value.phone}
            onChange={update("phone")}
            placeholder="+1 (555) 234-5678"
            data-ocid="personal.phone.input"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pi-location">
          Location <span className="text-destructive">*</span>
        </Label>
        <Input
          id="pi-location"
          value={value.location}
          onChange={update("location")}
          placeholder="San Francisco, CA"
          data-ocid="personal.location.input"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pi-linkedin">LinkedIn URL</Label>
        <Input
          id="pi-linkedin"
          value={value.linkedin}
          onChange={update("linkedin")}
          placeholder="linkedin.com/in/yourname"
          data-ocid="personal.linkedin.input"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pi-website">Website / Portfolio</Label>
        <Input
          id="pi-website"
          value={value.website}
          onChange={update("website")}
          placeholder="yourwebsite.com"
          data-ocid="personal.website.input"
        />
      </div>
    </div>
  );
}
