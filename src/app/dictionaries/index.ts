
// Import the application components and services.
import { descriptions as en_descriptions } from "./en/descriptions";
import { descriptions as es_descriptions } from "./es/descriptions";
import { things as en_things } from "./en/things";
import { things as es_things } from "./es/things";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

export var languages = {
	en: {
		descriptions: en_descriptions,
		things: en_things
	},
	es: {
		descriptions: es_descriptions,
		things: es_things
	}
};
