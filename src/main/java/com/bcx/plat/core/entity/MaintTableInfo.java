package com.bcx.plat.core.entity;

import com.bcx.plat.core.base.BaseEntity;
import com.bcx.plat.core.database.action.annotations.Table;
import com.bcx.plat.core.database.action.annotations.TablePK;
import com.bcx.plat.core.database.info.TableInfo;
import java.io.Serializable;

/**
 * Created by Went on 2017/7/31. 维护数据库表实体类
 */
@Table(TableInfo.T_DB_TABLES)
public class MaintTableInfo extends BaseEntity<MaintTableInfo> implements Serializable {

  @TablePK
  private String rowId;//id
  private String tableSchema;//表schema
  private String tableEName;//表中文名
  private String tableCName;//表英文名
  private String desp;//说明

  public String getRowId() {
    return rowId;
  }

  public void setRowId(String rowId) {
    this.rowId = rowId;
  }

  public String getTableSchema() {
    return tableSchema;
  }

  public void setTableSchema(String tableSchema) {
    this.tableSchema = tableSchema;
  }

  public String getTableEName() {
    return tableEName;
  }

  public void setTableEName(String tableEName) {
    this.tableEName = tableEName;
  }

  public String getTableCName() {
    return tableCName;
  }

  public void setTableCName(String tableCName) {
    this.tableCName = tableCName;
  }

  public String getDesp() {
    return desp;
  }

  public void setDesp(String desp) {
    this.desp = desp;
  }
}
