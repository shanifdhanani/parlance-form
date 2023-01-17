import { FunctionPlugin, FunctionArgumentType } from 'hyperformula';

export class ToCurrency extends FunctionPlugin {
    TO_CURRENCY(ast, state) {
        return this.runFunction(
            ast.args,
            state,
            this.metadata('TO_CURRENCY'),
            (num) =>  {
                const formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
                return `$${formatter.format(Number(num))}`;
            },
        );
  }
}

ToCurrency.implementedFunctions = {
  TO_CURRENCY: {
    method: 'TO_CURRENCY',
    parameters: [
      { argumentType: FunctionArgumentType.ANY }
    ],
  }
};

export const ToCurrencyTranslations = {
  enGB: {
    TO_CURRENCY: 'TO_CURRENCY',
  },
  enUS: {
    TO_CURRENCY: 'TO_CURRENCY',
  }
};