import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";

interface Props {
    url: string;
    width: number;
    height: number;
}

export const TerrariumImage = ({ url, width, height }: Props) => {
    const [image] = useImage(url);

    return <KonvaImage image={image} width={width} height={height} />;
};