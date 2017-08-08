package com.bcx.plat.core.entity;

import com.bcx.plat.core.base.BaseEntity;
import com.bcx.plat.core.database.info.TableInfo;
import com.bcx.plat.core.morebatis.annotations.Table;
import com.bcx.plat.core.morebatis.annotations.TablePK;

/**
 * 序列号生成 Entity，准确的来说，更像是序列号的历史表
 *
 * Create By HCL at 2017/8/8
 */
@Table(TableInfo.T_SEQUENCE_GENERATE)
public class SequenceGenerate extends BaseEntity<SequenceGenerate> {

  @TablePK
  private String rowId;
  private String seqRowId;
  private String variableKey;
  private String currentValue;
  private String branchSign;  // 分支标志

  public String getRowId() {
    return rowId;
  }

  public void setRowId(String rowId) {
    this.rowId = rowId;
  }

  public String getSeqRowId() {
    return seqRowId;
  }

  public void setSeqRowId(String seqRowId) {
    this.seqRowId = seqRowId;
  }

  public String getVariableKey() {
    return variableKey;
  }

  public void setVariableKey(String variableKey) {
    this.variableKey = variableKey;
  }

  public String getCurrentValue() {
    return currentValue;
  }

  public void setCurrentValue(String currentValue) {
    this.currentValue = currentValue;
  }

  public String getBranchSign() {
    return branchSign;
  }

  public void setBranchSign(String branchSign) {
    this.branchSign = branchSign;
  }
}
