import { Schema, model, Model, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IProduct } from './Product';

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'product'
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
      },      
    }
  ]
}, { timestamps: true });

cartSchema.plugin(mongoosePaginate);


export interface ICartItem {
  productId: Types.ObjectId | IProduct;
  quantity: number;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: Types.DocumentArray<ICartItem>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartModel extends Model<ICart> {
  paginate(
    query: object,
    options: object
  ): Promise<{
    docs: ICart[];
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

const Cart = model<ICart, ICartModel>('cart', cartSchema);

export default Cart;
