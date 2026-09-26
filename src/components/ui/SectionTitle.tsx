type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function SectionTitle({
  eyebrow,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div>
      {eyebrow && (
        <p className="font-semibold text-orange-500">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-1 text-3xl font-bold text-gray-900">
        {title}
      </h2>

      {description && (
        <p className="mt-2 text-gray-500">
          {description}
        </p>
      )}
    </div>
  );
}