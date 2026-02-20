export default function FileUpload() {
  return (
    <div className="border-2 border-dashed border-border-dark rounded-xl p-8 text-center hover:border-primary cursor-pointer">
      <span className="material-symbols-outlined text-text-muted">
        upload_file
      </span>
      <p className="font-medium mt-2">
        Click to upload or drag and drop
      </p>
      <p className="text-xs text-text-muted">
        PDF, DOCX or JPG (MAX. 5MB)
      </p>
    </div>
  );
}
