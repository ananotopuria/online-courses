import SliderImport, { type CustomArrowProps } from "react-slick";
import { slides } from "./hero.data";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Slider =
  (SliderImport as unknown as { default: typeof SliderImport }).default ??
  SliderImport;

function NextArrow({ onClick }: CustomArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-20 top-90 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 text-white transition hover:bg-white/20"
    >
      <IoIosArrowForward className="text-2xl" />
    </button>
  );
}

function PrevArrow({ onClick }: CustomArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-40 top-90 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 text-white transition hover:bg-white/20"
    >
      <IoIosArrowBack className="text-2xl" />
    </button>
  );
}

function Hero() {
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  console.log(slides);
  return (
    <section className="px-30 my-16">
      <Slider {...settings}>
        {slides.map((slide) => {
          return (
            <div key={slide.id}>
              <div
                className="relative h-110 rounded-4xl overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute top-12 left-12 text-white tracking-normal leading-0 max-w-300">
                  <h2 className="text-5xl font-bold">{slide.title}</h2>
                  <p className="mt-3 text-2xl font-light">
                    {slide.description}
                  </p>

                  <button className="mt-10 bg-primary-dark px-5 py-6 rounded-lg cursor-pointer">
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </section>
  );
}

export default Hero;
