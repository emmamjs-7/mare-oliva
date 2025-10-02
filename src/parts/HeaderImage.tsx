export default function HeaderImage() {
  return (
    <section
      className="header-img position-relative overflow-hidden shadow"
      aria-label="Mare Oliva header image"
    >
      <picture>
        <source type="image/avif" srcSet="/images/header-1600.avif" />
        <source type="image/webp" srcSet="/images/header-1600.webp" />
        <img
          src="/images/header.png"
          alt="Styling image with herbs, olive oil, lemon"
          aria-hidden="true"
          className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover object-position-right"
          width={1536}
          height={1024}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </picture>
    </section>
  );
}
