import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DictionaryApiService {

  apiRoot: string = 'https://api.dictionaryapi.dev/api/v2/entries';

  public async getWordDefinition(language: string, word: string): Promise<string>{

    try {

      const apiResponse : any = await this.httpClient.get(`${this.apiRoot}/${language}/${word}`).toPromise();

      // Return the first meaning.
      return apiResponse[0].meanings[0].definitions[0].definition;

    } catch(err) {
      console.error("Dictionary API error", err);
      // API error.
      return "Whoops: Dictionary API Error.";
    }
  }

  constructor(private httpClient: HttpClient) {}
}
