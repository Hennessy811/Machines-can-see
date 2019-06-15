import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AzureService {

  constructor(private http: HttpClient) { }

  sendToAzure(file) {
    const subscriptionKey = "9e01a1f542ed49159d84efd8003b6bde";

    const uriBase =
      "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

    const params = {
      "returnFaceLandmarks": "false",
      "returnFaceAttributes":
        "age,gender,smile,emotion"
    };

    return this.http.post(uriBase, file, {
      params: params,
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-Type': 'application/octet-stream'
      }
    })
  }
}
