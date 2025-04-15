import { CredentialSubject } from "../../agreement/dtos/base.dto";
import { DataAsset, DataAssetPresentation } from "../../agreement/dtos/data-asset.dto";

  export function buildDataAssetFromPresentation(registerDto: DataAssetPresentation): DataAsset {
    const credentialSubject = registerDto.verifiableCredential[0].credentialSubject as CredentialSubject;
    const subjects = Array.isArray(credentialSubject) ? credentialSubject : [credentialSubject];

    // Create the result object using a copy of the first element’s properties
    const result = { ...subjects[0] };
    // Loop through the remaining elements and add them as new keys based on their type
    subjects.slice(1).forEach((item) => {
      let key = item.type;
      if (Array.isArray(key)) {
        key = key[0];
      }
      result[key] = item;
    });
    return result;
  }