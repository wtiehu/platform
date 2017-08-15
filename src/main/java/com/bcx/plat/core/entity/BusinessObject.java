package com.bcx.plat.core.entity;

import static com.bcx.plat.core.utils.UtilsTool.lengthUUID;

import com.bcx.plat.core.base.BaseConstants;
import com.bcx.plat.core.base.BaseEntity;
import com.bcx.plat.core.manager.SequenceManager;
import com.bcx.plat.core.morebatis.annotations.Table;
import com.bcx.plat.core.database.info.TableInfo;
import com.bcx.plat.core.morebatis.annotations.TablePK;

import com.bcx.plat.core.morebatis.annotations.TablePK;
import java.io.Serializable;

/**
 * 业务对象实体类 Created by Went on 2017/8/1.
 */
@Table(TableInfo.T_BUSINESS_OBJECT)
public class BusinessObject extends BaseEntity<BusinessObject> implements Serializable {
  @TablePK
  private String rowId;//唯一标识
  private String objectCode;//对象代码
  private String objectName;//对象名称
  private String relateTableRowId;//关联表
  private String changeOperat;//执行变更操作


  /**
   * 构建 - 创建信息
   *
   * @return 返回自身
   */
  @Override
  public BusinessObject buildCreateInfo() {
    this.objectCode = SequenceManager.getInstance().buildSequenceNo("BusinObject",null);
    setChangeOperat(BaseConstants.CHANGE_OPERAT_FAIL);
    setRowId(lengthUUID(32));
    setVersion("1.0");
    setStatus(BaseConstants.INVALID);
    return super.buildCreateInfo();
  }

  public String getChangeOperat() {
    return changeOperat;
  }

  public void setChangeOperat(String changeOperat) {
    this.changeOperat = changeOperat;
  }

  public String getRowId() {
    return rowId;
  }

  public void setRowId(String rowId) {
    this.rowId = rowId;
  }

  public String getObjectCode() {
    return objectCode;
  }

  public void setObjectCode(String objectCode) {
    this.objectCode = objectCode;
  }

  public String getObjectName() {
    return objectName;
  }

  public void setObjectName(String objectName) {
    this.objectName = objectName;
  }

  public String getRelateTableRowId() {
    return relateTableRowId;
  }

  public void setRelateTableRowId(String relateTableRowId) {
    this.relateTableRowId = relateTableRowId;
  }


}
