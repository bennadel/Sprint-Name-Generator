
// Import the core angular services.
import { Component } from "@angular/core";

// Import the application components and services.
import { Language } from "./dictionaries";
import { languages } from "./dictionaries";

import {DictionaryApiService} from "./dictionary-api.service";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "app-root",
	styleUrls: [ "./app.component.less" ],
	templateUrl: "./app.component.html"
})
export class AppComponent {

	public partOneIndex: number;
	public partOneItems: string[];
	public partTwoIndex: number;
	public partTwoItems: string[];
	public sprintName: string;
	public selectedLanguage: string;
	public adjectiveDefinition: string;
	public thingDefinition: string;

	// I initialize the app component.
	constructor(private dictionaryApiService: DictionaryApiService) {

		var language = this.selectLanguage();

		this.sprintName = "";
		this.partOneIndex = 0;
		this.partTwoIndex = 0;
		this.selectedLanguage = language.name;
		this.adjectiveDefinition = "";
		this.thingDefinition = "";

		if ( language.order === "description-first" ) {

			this.partOneItems = language.descriptions;
			this.partTwoItems = language.things;

		} else {

			this.partOneItems = language.things;
			this.partTwoItems = language.descriptions;

		}

		this.generateName();

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I generate the next Sprint Name by randomly selecting a Description and a Thing
	// and then joining the two values.
	public generateName() : void {

		// Clear while we're generating a new name.
		this.adjectiveDefinition = "";
		this.thingDefinition = "";

		// Randomly select next parts of the name.
		this.partOneIndex = this.nextIndex( this.partOneIndex, this.partOneItems );
		this.partTwoIndex = this.nextIndex( this.partTwoIndex, this.partTwoItems );

		this.sprintName = (
			this.partOneItems[ this.partOneIndex ] +
			" " +
			this.partTwoItems[ this.partTwoIndex ]
		);

		this.shareSprintNameWithUser( this.sprintName );

	}

	// I fetch a definition for the adjective and load an image of the animal.
	public async getDetails() : Promise<void> {

		this.adjectiveDefinition = await this.dictionaryApiService.getWordDefinition("en", this.partOneItems[ this.partOneIndex ]);

		this.thingDefinition = await this.dictionaryApiService.getWordDefinition("en", this.partTwoItems[ this.partTwoIndex ]);

	}

	// ---
	// PRIVATE METHODS.
	// ---

	// I try to copy the value to the user's clipboard. Returns Boolean indicating
	// whether or not the operation appeared to be successful.
	private copyToClipboard( value: string ) : boolean {

		// In order to execute the "Copy" command, we actually have to have a "selection"
		// in the rendered document. As such, we're going to inject a Textarea element,
		// populate it with the given value, select it, and then copy it. Since this
		// operation is going to change the document selection, let's get a reference to
		// the currently-active element (expected to be our "Generate" button) such that
		// we can return focus after the copy command has executed.
		var activeElement = <HTMLElement | null>document.activeElement;

		var textarea: HTMLTextAreaElement = document.createElement( "textarea" );
		textarea.style.opacity = "0";
		textarea.style.position = "fixed";
		textarea.value = value;
		// Set and select the value (creating an active Selection range).
		document.body.appendChild( textarea );
		textarea.select();

		try {

			// CAUTION: Even though this may not throw an error, the COPY command does
			// not appear to work unless it is in response to a direct user interaction.
			// Meaning, nothing gets copied until the user actually CLICKS the button to
			// generate a new name. Not sure why that is? Maybe a security issue?
			document.execCommand( "copy" );
			return( true );

		} catch ( error ) {

			return( false );

		} finally {

			// Return focus to the active element, if we had one.
			if ( activeElement ) {

				activeElement.focus();

			}

			document.body.removeChild( textarea );

		}

	}


	// I return a random index for selection within the given collection.
	private nextIndex( currentIndex: number, collection: any[] ) : number {

		var nextIndex = currentIndex;
		var length = collection.length;

		// Keep generating a random index until we get a non-matching value. This just
		// ensures some "change" from generation to generation.
		while ( nextIndex === currentIndex ) {

			nextIndex = ( Math.floor( Math.random() * length ) );

		}

		return( nextIndex );

	}


	// I select the language package based on the current URL.
	private selectLanguage() : Language {

		var searchString = window.location.search.slice( 1 );
		var languagePair = searchString.match( /(^|&)lang=(en|es)\b/i );

		var languageCode = languagePair
			? languagePair[ 2 ]
			: "en"
		;

		switch ( languageCode ) {
			case "es":
				return( languages.es );
			break;
			default:
				return( languages.en );
			break;
		}

	}


	// I share the given Sprint Name with the user.
	private shareSprintNameWithUser( sprintName: string ) : void {

		// As a convenience, try to copy the new name to the user's clipboard.
		var nameWasCopied = this.copyToClipboard( sprintName );

		// Also, let's log the name to the user's console.
		console.group(
			"%c Sprint Name Generator ",
			"background-color: #121212 ; color: #ffffff ;"
		);
		console.log(
			`%c${ sprintName }`,
			"color: #ff3366 ;"
		);
		if ( nameWasCopied ) {
		
			console.log(
				"%cThis name was copied to your clipboard.",
				"font-style: italic ;"
			);
		
		}
		console.groupEnd();

	}

}
