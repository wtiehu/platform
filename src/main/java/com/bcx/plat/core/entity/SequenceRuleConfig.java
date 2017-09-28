package com.bcx.plat.core.entity;

import com.bcx.plat.core.base.BaseEntity;

/**
 * 序列号规则配置 pojo 类
 * <p>
 * Create By HCL at 2017/8/6
 */
public class SequenceRuleConfig extends BaseEntity<SequenceRuleConfig> {

  private String seqCode;//代码
  private String seqName;//名称
  private String seqContent;//内容
  private String desp;//说明
  private String belongModule;//所属模块
  private String belongSystem;//所属系统

  @Override
  public SequenceRuleConfig buildCreateInfo() {
    getBaseTemplateBean().setVersion("1.0");
    return super.buildCreateInfo();
  }

  public String getRowId() {
    return rowId;
  }

  public String getBelongModule() {
    return belongModule;
  }

  public void setBelongModule(String belongModule) {
    this.belongModule = belongModule;
  }

  public String getBelongSystem() {
    return belongSystem;
  }

  public void setBelongSystem(String belongSystem) {
    this.belongSystem = belongSystem;
  }

  public void setRowId(String rowId) {
    this.rowId = rowId;
  }

  public String getSeqCode() {
    return seqCode;
  }

  public void setSeqCode(String seqCode) {
    this.seqCode = seqCode;
  }

  public String getSeqName() {
    return seqName;
  }

  public void setSeqName(String seqName) {
    this.seqName = seqName;
  }

  public String getSeqContent() {
    return seqContent;
  }

  public void setSeqContent(String seqContent) {
    this.seqContent = seqContent;
  }

  public String getDesp() {
    return desp;
  }

  public void setDesp(String desp) {
    this.desp = desp;
  }
}
