
import { Ratio } from "react-bootstrap";

type Props = {
  baseName: string;
  widths: number[];
  alt: string;
  sizes?: string;
  fallbackExt?: "png";
  className?: string;
  aspectRatio?: string;
  loading?: "lazy" | "eager";
};

export default function ResponsiveImage({
  baseName,
  widths,
  alt,
  sizes = "(max-width: 576px) 100vw, (max-width: 992px) 50vw, 50vw",
  className,
  aspectRatio = "16x9",
  loading = "lazy",
}: Props) {
  const srcSet = (ext: string) =>
    widths.map((w) => `/images/${baseName}-${w}.${ext} ${w}w`).join(", ");

  return (
    <Ratio aspectRatio={aspectRatio} className="rounded overflow-hidden shadow">
      <picture>
        <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
        <img
          src={`/images/${baseName}.png`}
          alt={alt}
          className={className}
          width={1024}
          height={682}
          loading={loading}
          decoding="async"
        />
      </picture>
    </Ratio>
  );
}
