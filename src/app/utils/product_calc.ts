import { Order, Products, productToOrder } from '../models/products';

export class ProductCalculator {
  products: Products[];
  constructor(products: Products[]) {
    this.products = products;
  }

  countCategories(): number {
    const categories = new Set();
    this.products.forEach((value) => {
      categories.add(value.category.toLocaleLowerCase());
    });
    return categories.size;
  }

  getTargetStocksPerMonth(months: string[]): number[] {
    let targetSales: number[] = [];
    months.forEach((value) => {
      targetSales.push(this.getTargetSalesPerMoth(value));
    });

    return targetSales;
  }

  getTargetSalesPerMoth(month: string) {
    let count = 0;
    const currentYear = new Date().getFullYear();
    this.products.forEach((data) => {
      const monthYear = data.createdAt.toLocaleString('default', {
        month: 'short',
      });

      if (monthYear === month && data.createdAt.getFullYear() === currentYear) {
        if (data.variations.length === 0) {
          count += data.stocks * data.price;
        } else {
          data.variations.forEach((e) => {
            count += e.stocks * e.price;
          });
        }
      }
    });
    return count;
  }

  getTotalPurchases() {
    let totalPurchase = 0;
    this.products.map((e) => {
      if (e.variations.length == 0) {
        totalPurchase += e.stocks * e.cost;
      } else {
        e.variations.map((variation) => {
          totalPurchase += variation.stocks * variation.cost;
        });
      }
    });
    return totalPurchase;
  }

  getTotalSalesValue() {
    let totalSales = 0;
    this.products.map((e) => {
      if (e.variations.length == 0) {
        totalSales += e.stocks * e.price;
      } else {
        e.variations.map((variation) => {
          totalSales += variation.stocks * variation.price;
        });
      }
    });
    return totalSales;
  }
  getTotalPriceLast7Days(): number {
    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    let totalPrice = 0;

    this.products.forEach((product) => {
      if (
        product.createdAt >= sevenDaysAgo &&
        product.createdAt <= currentDate
      ) {
        if (product.variations.length === 0) {
          totalPrice += product.stocks * product.price;
        } else {
          product.variations.forEach((variation) => {
            totalPrice += variation.stocks * variation.price;
          });
        }
      }
    });

    return totalPrice;
  }

  countProductsLessThan20(): number {
    return this.products.reduce((count, product) => {
      if (product.variations.length === 0) {
        if (product.stocks < 20) {
          count++;
        }
      } else {
        const variationStocks = product.variations.reduce(
          (total, variation) => total + variation.stocks,
          0
        );
        if (variationStocks < 20) {
          count++;
        }
      }
      return count;
    }, 0);
  }

  countProductsNoStocks(): number {
    return this.products.reduce((count, product) => {
      if (product.variations.length === 0) {
        if (product.stocks === 0) {
          count++;
        }
      } else {
        const variationStocks = product.variations.reduce(
          (total, variation) => total + variation.stocks,
          0
        );
        if (variationStocks === 0) {
          count++;
        }
      }
      return count;
    }, 0);
  }
}
