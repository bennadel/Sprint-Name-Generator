
// Import the application components and services.
import { descriptions as en_descriptions } from "./en/descriptions";
import { descriptions as es_descriptions } from "./es/descriptions";
import { things as en_things } from "./en/things";
import { things as es_things } from "./es/things";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

export interface Language {
	name: string;
	order: "description-first" | "thing-first";
	descriptions: string[];
	things: string[];
}

export interface Languages {
	[ key: string ]: Language;
}

export var languages: Languages = {
	en: {
		name: "English",
		order: "description-first",
		descriptions: en_descriptions,
		things: en_things
	},
	es: {
		name: "Spanish",
		order: "thing-first",
		descriptions: es_descriptions,
		things: es_things
	}
};
