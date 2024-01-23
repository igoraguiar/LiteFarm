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

import { transaction, Model } from 'objection';
import baseController from './baseController.js';

import CustomAnimalTypeModel from '../models/customAnimalTypeModel.js';

const customAnimalTypeController = {
  getCustomAnimalTypes() {
    return async (req, res) => {
      try {
        const { farm_id } = req.headers;
        const rows = await CustomAnimalTypeModel.query().where({ farm_id });
        return res.status(200).send(rows);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          error,
        });
      }
    };
  },

  addCustomAnimalType() {
    return async (req, res) => {
      const trx = await transaction.start(Model.knex());
      try {
        const { farm_id } = req.headers;
        let { type } = req.body;

        if (!type || !type.trim()) {
          return res.status(400).send('Animal type must be provided');
        }

        type = type.trim();

        const record = await baseController.existsInTable(trx, CustomAnimalTypeModel, {
          type,
          farm_id,
          deleted: false,
        });

        if (record) {
          await trx.rollback();
          return res.status(409).send();
        } else {
          const result = await baseController.postWithResponse(
            CustomAnimalTypeModel,
            { type, farm_id },
            req,
            {
              trx,
            },
          );

          await trx.commit();
          return res.status(201).send(result);
        }
      } catch (error) {
        await trx.rollback();
        console.error(error);
        return res.status(500).json({ error });
      }
    };
  },
};

export default customAnimalTypeController;
