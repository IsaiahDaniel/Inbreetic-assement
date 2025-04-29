import { Schema, Types, model, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new Schema({
  name: String,
  price: Number,
  stock: {
    type: Number,
    required: true,
  }
}, { timestamps: true });


productSchema.plugin(mongoosePaginate);

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}


export interface IProductModel extends Model<IProduct> {
  paginate(
    query: object,
    options: object
  ): Promise<{
    docs: IProduct[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  }>;
}

const Product = model<IProduct, IProductModel>('product', productSchema);

export default Product;
