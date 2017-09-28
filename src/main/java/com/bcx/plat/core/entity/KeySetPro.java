package com.bcx.plat.core.entity;

import com.bcx.plat.core.base.BaseEntity;

/**
 * <p>Title: keySetPro</p>
 * <p>Description: 键值集合属性明细实体类</p>
 * <p>Copyright: Shanghai Batchsight GMP Information of management platform, Inc. Copyright(c) 2017</p>
 *
 * @author Wen TieHu
 * @version 1.0
 * <pre>Histroy:
 *                2017/8/30  Wen TieHu Create
 *          </pre>
 */
public class KeySetPro extends BaseEntity<KeySetPro> {

  private String relateKeysetRowId;//关联键值集合唯一标示
  private String confKey;//键
  private String confValue;//值
  private String desp;//说明

  /**
   * 构建 - 创建信息
   *
   * @return 返回自身
   */
  @Override
  public KeySetPro buildCreateInfo() {
    return super.buildCreateInfo();
  }

  public String getRowId() {
    return rowId;
  }

  public void setRowId(String rowId) {
    this.rowId = rowId;
  }

  public String getRelateKeysetRowId() {
    return relateKeysetRowId;
  }

  public void setRelateKeysetRowId(String relateKeysetRowId) {
    this.relateKeysetRowId = relateKeysetRowId;
  }

  public String getConfKey() {
    return confKey;
  }

  public void setConfKey(String confKey) {
    this.confKey = confKey;
  }

  public String getConfValue() {
    return confValue;
  }

  public void setConfValue(String confValue) {
    this.confValue = confValue;
  }

  public String getDesp() {
    return desp;
  }

  public void setDesp(String desp) {
    this.desp = desp;
  }
}
