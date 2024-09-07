import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class SoftDelete {
  @Prop({ type: Boolean })
  isSoftDeleted: boolean;
}
