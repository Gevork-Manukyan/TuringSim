import './Arrow.scss'
import { Coords } from '../../lib/types';
import { Arrow as SvgArrow } from 'react-absolute-svg-arrows';

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
    value?: string;
    startPoint: Coords;
    endPoint: Coords;
    isHighlighted?: boolean;
    showDebugGuideLines?: boolean;
    onMouseEnter?: (e: React.MouseEvent) => void;
    onMouseLeave?: (e: React.MouseEvent) => void;
    onClick?: (e: React.MouseEvent) => void;
    config?: ArrowConfig;
    tooltip?: string;
};

const config: ArrowConfig = {
    arrowColor: '#777',
    arrowHighlightedColor: '#235468',
    dotEndingRadius: 0,
    arrowHeadEndingSize: 100,
    strokeWidth: 10,
}

export default function Arrow({ className, value='', startPoint, endPoint }: ArrowProps) {
    return (
        <div className={`Arrow${ className ? className : ''}`}>
            <SvgArrow 
                showDebugGuideLines
                config={config}
                startPoint={startPoint}
                endPoint={endPoint}
                isHighlighted
            />
        </div>
    )
}