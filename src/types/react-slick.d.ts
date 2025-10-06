declare module 'react-slick' {
  import { Component, ReactNode } from 'react';
  
  interface Settings {
    slidesToShow?: number;
    slidesToScroll?: number;
    arrows?: boolean;
    dots?: boolean;
    infinite?: boolean;
    autoplay?: boolean;
    appendDots?: (dots: ReactNode) => React.ReactElement;
    appendArrows?: (arrows: ReactNode) => React.ReactElement;
    prevArrow?: React.ReactElement;
    nextArrow?: React.ReactElement;
    responsive?: Array<{
      breakpoint: number;
      settings: Partial<Settings>;
    }>;
    className?: string;
    onInit?: () => void;
    onReInit?: () => void;
  }

  interface SliderProps extends Settings {
    children?: ReactNode;
  }

  interface InnerSlider {
    onWindowResized?(): void;
  }

  interface SliderMethods {
    slickPrev(): void;
    slickNext(): void;
    slickGoTo(slideNumber: number, dontAnimate?: boolean): void;
    slickPause(): void;
    slickPlay(): void;
    innerSlider?: InnerSlider;
  }

  export default class Slider extends Component<SliderProps> implements SliderMethods {
    slickPrev(): void;
    slickNext(): void;
    slickGoTo(slideNumber: number, dontAnimate?: boolean): void;
    slickPause(): void;
    slickPlay(): void;
    innerSlider?: InnerSlider;
  }
}
