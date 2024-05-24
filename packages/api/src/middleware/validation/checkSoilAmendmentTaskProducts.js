/*
 *  Copyright (c) 2024 LiteFarm.org
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

import ProductModel from '../../models/productModel.js';

export function checkSoilAmendmentTaskProducts() {
  return async (req, res, next) => {
    try {
      const { soil_amendment_task_products } = req.body.soil_amendment_task;

      if (!Array.isArray(soil_amendment_task_products)) {
        return res.status(400).send('soil_amendment_task_products must be an array');
      }

      if (!soil_amendment_task_products.length) {
        return res.status(400).send('soil_amendment_task_products is required');
      }

      for (const product of soil_amendment_task_products) {
        if (!product.product_id) {
          return res.status(400).send('product_id is required');
        }

        if (!product.product_quantity) {
          return res.status(400).send('product_quantity is required');
        }

        if (!product.product_quantity_unit) {
          return res.status(400).send('product_quantity_unit is required');
        }

        if (product.application_rate && !product.application_rate_unit) {
          return res.status(400).send('application_rate_unit is required');
        }

        const existingProduct = await ProductModel.query()
          .where({
            product_id: product.product_id,
            farm_id: req.headers.farm_id,
            type: 'soil_amendment_task',
          })
          .first();

        if (!existingProduct) {
          return res
            .status(400)
            .send(
              `Soil amendment product ${product.product_id} does not exist or does not belong to the given farm`,
            );
        }
      }
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error,
      });
    }
  };
}
