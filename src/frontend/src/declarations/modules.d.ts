declare module "html2canvas" {
  function html2canvas(
    element: HTMLElement,
    options?: Record<string, unknown>,
  ): Promise<HTMLCanvasElement>;
  export default html2canvas;
}

declare module "jspdf" {
  interface jsPDFOptions {
    unit?: string;
    format?: string | number[];
    orientation?: string;
  }
  class jsPDF {
    constructor(options?: jsPDFOptions);
    addImage(
      data: string,
      format: string,
      x: number,
      y: number,
      w: number,
      h: number,
    ): void;
    addPage(): void;
    output(type: "blob"): Blob;
    output(type: string): unknown;
  }
  export { jsPDF };
}
