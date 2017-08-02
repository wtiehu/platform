package com.bcx.plat.core.database.action.singleton;

import com.bcx.plat.core.database.action.phantom.Column;
import com.bcx.plat.core.database.action.substance.Field;


/**
 * 供单例模式使用的不可变字段
 */
public class ImmuteField implements Column {

  Column field;

  public ImmuteField(Field field) {
    this.field = field;
  }

  @Override
  public String getColumnSqlFragment() {
    return field.getColumnSqlFragment();
  }

  @Override
  public String getAlies() {
    return field.getAlies();
  }

  @Override
  public String getFieldSource() {
    return field.getFieldSource();
  }
}
