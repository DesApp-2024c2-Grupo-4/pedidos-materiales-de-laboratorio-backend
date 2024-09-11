import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class InUse {
  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop({ type: Number })
  quantity: number;
}
