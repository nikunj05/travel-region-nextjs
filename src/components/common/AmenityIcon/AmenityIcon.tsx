import React from "react";
import {
  Wifi,
  Waves,
  Utensils,
  ParkingCircle,
  Dumbbell,
  ArrowUpDown,
  Bath,
  Clock,
  Bus,
  ConciergeBell,
  WashingMachine,
  Stethoscope,
  Shield,
  AirVent,
  Sprout,
  Sun,
  Coffee,
  Wine,
  Users,
  Briefcase,
  BaggageClaim,
  Goal,
  ShipWheel,
  // Lock,
  Building,
  Newspaper,
  Beer,
  Gamepad2,
  Tv,
  Signal,
  Languages,
  Phone,
  CakeSlice,
  Flame,
  Wind,
  Presentation,
  LogIn,
  CreditCard,
  Car,
  Baby,
  FireExtinguisher,
  Banknote,
  Shirt,
  Copy,
  Hand,
  TreePine,
  IdCard,
  Info,
  Crown,
  Plane,
} from "lucide-react";

interface AmenityIconProps {
  facilityCode: number;
}

const AmenityIcon = ({ facilityCode }: AmenityIconProps) => {
  const iconProps = {
    color: "#2B7FFF",
    size: 20,
    style: { marginRight: "0px" },
  };

  switch (facilityCode) {
    case 550:
      return <Wifi {...iconProps} />;
    case 363:
      return <Waves {...iconProps} />;
    case 200:
      return <Utensils {...iconProps} />;
    case 320:
      return <ParkingCircle {...iconProps} />;
    case 470:
      return <Dumbbell {...iconProps} />;
    case 70:
      return <ArrowUpDown {...iconProps} />;
    case 295:
      return <ShipWheel {...iconProps} />;
    case 30:
      return <Clock {...iconProps} />;
    case 562:
      return <Bus {...iconProps} />;
    case 270:
    case 585: // Concierge
    case 525: // Bellboy service
      return <ConciergeBell {...iconProps} />;
    case 280:
    case 568: // Clothes dryer
      return <WashingMachine {...iconProps} />;
    case 290:
      return <Stethoscope {...iconProps} />;
    case 520:
      return <Shield {...iconProps} />;
    case 10: // Air conditioning
      return <AirVent {...iconProps} />;
    case 125:
      return <Sprout {...iconProps} />;
    case 135:
      return <Sun {...iconProps} />;
    case 80:
      return <Coffee {...iconProps} />;
    case 130:
      return <Wine {...iconProps} />;
    case 170:
      return <Users {...iconProps} />;
    case 605:
      return <Briefcase {...iconProps} />;
    case 559:
      return <BaggageClaim {...iconProps} />;
    case 390:
      return <Goal {...iconProps} />;
    case 40:
      return <Wind {...iconProps} />; // Hairdryer
    case 50:
      return <Building {...iconProps} />;
    case 90:
    case 515:
      return <Newspaper {...iconProps} />;
    case 140:
      return <Beer {...iconProps} />;
    case 190:
      return <Gamepad2 {...iconProps} />;
    case 193:
      return <Tv {...iconProps} />;
    case 55:
      return <Tv {...iconProps} />;
    case 240:
      return <Signal {...iconProps} />;
    case 505:
      return <Languages {...iconProps} />;
    case 556:
      return <Phone {...iconProps} />;
    case 560:
      return <CakeSlice {...iconProps} />;
    case 571:
      return <Flame {...iconProps} />;
    case 575:
      return <Presentation {...iconProps} />;
    case 260:
      return <LogIn {...iconProps} />; // Check-in hour
    case 60:
      return <CreditCard {...iconProps} />; // Visa payment method
    case 80:
      return <CreditCard {...iconProps} />; // Maestro payment method
    case 90:
      return <CreditCard {...iconProps} />; // Visa Electrón payment method
    case 100:
      return <Crown {...iconProps} />; // Suites
    case 124:
      return <ShipWheel {...iconProps} />; // Disability-friendly rooms
    case 490:
      return <Car {...iconProps} />; // Car hire
    case 500:
      return <Shield {...iconProps} />; // Secure parking
    case 560:
      return <Car {...iconProps} />; // Valet parking
    case 285:
      return <WashingMachine {...iconProps} />; // Launderette
    case 485:
      return <Baby {...iconProps} />; // Babysitting service
    case 11:
      return <FireExtinguisher />; // Fireplace
    case 50:
      return <Banknote {...iconProps} />; // Currency exchange facilities
    case 60:
      return <Shirt {...iconProps} />; // Cloakroom
    case 569:
      return <Flame {...iconProps} />; // BBQ facilities
    case 578:
      return <WashingMachine {...iconProps} />; // Towels and bed linen
    case 225:
      return <FireExtinguisher {...iconProps} />; // Smoking area
    case 230:
      return <Bath {...iconProps} />; // Bathroom
    case 595:
      return <Briefcase {...iconProps} />; // Secretarial service
    case 600:
      return <Copy {...iconProps} />; // Photocopier
    case 450:
      return <Hand {...iconProps} />; // Massage
    case 620:
      return <Waves {...iconProps} />; // Spa centre
    case 210:
      return <TreePine {...iconProps} />; // Picnic
    case 557:
      return <IdCard {...iconProps} />; // Identification card at arrival
    case 564:
      return <Info {...iconProps} />; // Minimum check-in age
    case 97:
      return <Info {...iconProps} />; // Other Protocol
    case 495:
      return <Plane {...iconProps} />; // Transfer service
    default:
      return <Info {...iconProps} />;
  }
};

export default AmenityIcon;
