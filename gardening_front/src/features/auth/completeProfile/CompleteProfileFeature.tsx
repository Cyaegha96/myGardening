import useCompleteProfileModel from './useCompleteProfileModel';
import CompleteProfileView from './CompleteProfileView';

interface CompleteProfileFeatureProps {
    pageTitle?: string,
    pageDescription?: string
}

export default function CompleteProfileFeature({pageTitle, pageDescription}: CompleteProfileFeatureProps) {
    const model = useCompleteProfileModel();

    return <CompleteProfileView {...model}

                                pageTitle={pageTitle}
                                pageDescription={pageDescription}/>;
}
