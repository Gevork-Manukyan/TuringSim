import './Arrow.scss'
import { Arrow as SvgArrow } from 'react-absolute-svg-arrows';

export type Point = {
    x: number;
    y: number;
};

type ArrowConfig = {
    arrowColor?: string;
    arrowHighlightedColor?: string;
    controlPointsColor?: string;
    boundingBoxColor?: string;
    dotEndingBackground?: string;
    dotEndingRadius?: number;
    arrowHeadEndingSize?: number;
    hoverableLineWidth?: number;
    strokeWidth?: number;
};
  
type ArrowProps = {
    className?: string;
    startPoint: Point;
    endPoint: Point;
    isHighlighted?: boolean;
    showDebugGuideLines?: boolean;
    onMouseEnter?: (e: React.MouseEvent) => void;
    onMouseLeave?: (e: React.MouseEvent) => void;
    onClick?: (e: React.MouseEvent) => void;
    config?: ArrowConfig;
    tooltip?: string;
};

export default function Arrow({ className, startPoint, endPoint }: ArrowProps) {
    return (
        <SvgArrow 
            startPoint={startPoint}
            endPoint={endPoint}
        />
    )
}