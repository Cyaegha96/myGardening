import { create } from 'zustand';

export interface PlantDetail {
    scientificName: string;
    commonName: string;
    family: string;
    genus: string;
    origin: string;
    environment: string;
    light: string;
    temperatureHumidity: string;
    watering: string;
    soil: string;
    fertilizer: string;
    potRepot: string;
    propagation: string;
    pestsTips: string;
    commonUses: string;
    culturalSignificance: string;
    description: string;
    sampleImageUrl: string | null;
    tags: PlantTag[];
}

export interface PlantTag{
    tagId:number;
    tagName:string;
}

interface PlantHistoryItem {
    plant: PlantDetail;
    file?: File;
    filePreview?: string;
}


interface PlantState {
    files?: File[];
    filePreview?: string;
    analysisResult?: PlantDetail | null;
    isUploading: boolean;
    history: PlantHistoryItem[];
    setFiles: (files?: File[]) => void;
    setFilePreview: (preview?: string) => void;
    setAnalysisResult: (result?: PlantDetail | null) => void;
    addToHistory: (plantHistory: PlantHistoryItem) => void;
    loadFromHistory:(plantHistory: PlantHistoryItem) => void;
    setIsUploading: (uploading: boolean) => void;
    reset: () => void;
}

export const useSearchPlantStore = create<PlantState>((set) => ({
    files: undefined,
    filePreview: undefined,
    analysisResult: null,
    isUploading: false,
    history: [],
    setFiles: (files) => set({ files }),
    setFilePreview: (filePreview) => set({ filePreview }),
    setAnalysisResult: (analysisResult) => set({ analysisResult }),
    setIsUploading: (isUploading) => set({ isUploading }),
    addToHistory: (item) =>
        set((state) => ({
            history: [item, ...state.history.filter(h => h.plant.commonName !== item.plant.commonName)].slice(0, 10),
        })),
    loadFromHistory: (item) =>
        set({
            analysisResult: item.plant,
            files: item.file ? [item.file] : undefined,
            filePreview: item.filePreview,
            isUploading: false,
        }),
    reset: () => set({
        files: undefined,
        filePreview: undefined,
        analysisResult: null,
        isUploading: false,
    }),
}));
