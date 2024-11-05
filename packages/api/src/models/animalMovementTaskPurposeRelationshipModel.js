/*
 *  Copyright 2024 LiteFarm.org
 *  This file is part of LiteFarm.
 *
 *  LiteFarm is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  LiteFarm is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details, see <https://www.gnu.org/licenses/>.
 */

import Model from './baseFormatModel.js';

class AnimalMovementTaskPurposeRelationship extends Model {
  static get tableName() {
    return 'animal_movement_task_purpose_relationship';
  }

  static get idColumn() {
    return ['task_id', 'purpose_id'];
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['task_id', 'purpose_id'],
      properties: {
        task_id: { type: 'integer' },
        purpose_id: { type: 'integer' },
        other_purpose: { type: ['string', 'null'], minLength: 1, maxLength: 255 },
      },
      additionalProperties: false,
    };
  }
}

export default AnimalMovementTaskPurposeRelationship;
