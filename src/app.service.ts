import { HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { savePOItem } from './library/savePo';

const validationResponse = (statusCode, message) => {
  return {
    statusCode,
    body: {
      status: 'failed_validation',
      data: message,
    },
  };
};

@Injectable()
export class AppService {
  async purchaseOrderUpload(vendorName, date, po): Promise<any> {
    try {
      // check if date is a valid date
      if (isNaN(Date.parse(date))) {
        return validationResponse(400, 'date must be a valid date');
      }

      // check date year past 1900
      if (new Date(date).getFullYear() < 1900) {
        return validationResponse(400, 'date year must be past 1900');
      }

      // check vendor name is a string
      if (!vendorName || typeof vendorName !== 'string') {
        return validationResponse(400, 'vendor name must be a string');
      }
      const filename = `./uploads/csv/${po.filename}`;
      const stream = fs.readFileSync(filename);

      //replace all \r with `` in stream
      const modifiedString = stream.toString().replace(/\r/g, '');
      const splitStream = modifiedString.split('\n');

      // check first row for correct header
      const header = splitStream[0].split(',');
      if (
        header[0] !== 'Model Number' ||
        header[1] !== 'Unit Price' ||
        header[2] !== 'Quantity'
      ) {
        return validationResponse(400, 'incorrect csv header');
      }

      const validData = [];

      for (let i = 1; i < splitStream.length; i++) {
        const [modelNumber, unitPrice, quantity] = splitStream[i].split(',');
        if (!modelNumber || typeof modelNumber !== 'string') {
          return validationResponse(400, 'model number must be a string');
        }

        //ensure quantity is a number
        if (!quantity || isNaN(parseInt(quantity))) {
          //throw new Error('quantity must be a number');
          return validationResponse(400, 'quantity must be a number');
        }

        //ensure unit price is a float or decimal
        if (unitPrice == undefined || isNaN(parseFloat(unitPrice))) {
          return validationResponse(
            400,
            'unit price must be a float or decimal',
          );
        }

        validData.push({
          modelNumber,
          unitPrice,
          quantity,
        });
      }

      const id = uuidv4();

      if (validData.length) {
        await savePOItem({
          id,
          vendorName,
          date,
          details: validData,
        });
      }

      return {
        statusCode: 200,
        body: {
          status: 'success',
          data: 'purchaseOrderUpload',
        },
      };
    } catch (e) {
      console.log('e', e);
      return {
        statusCode: 500,
        body: {
          status: 'error',
          data: e.message,
        },
      };
    }
  }
}
