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
  }

  interface SliderProps extends Settings {
    children?: ReactNode;
  }

  export default class Slider extends Component<SliderProps> {}
}
