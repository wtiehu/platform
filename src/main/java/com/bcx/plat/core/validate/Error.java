package com.bcx.plat.core.validate;

import java.io.Serializable;

/**
 * 错误信息容器
 * <p>
 * Create By HCL at 2017/9/21
 */
public class Error implements Serializable {

  private String fieldName;
  private String errorMessage;

  /**
   * 当前不允许在其他地方进行构造
   *
   * @param fieldName    属性名称
   * @param errorMessage 错误消息
   */
  protected Error(String fieldName, String errorMessage) {
    this.fieldName = fieldName;
    this.errorMessage = errorMessage;
  }

  public String getFieldName() {
    return fieldName;
  }

  public void setFieldName(String fieldName) {
    this.fieldName = fieldName;
  }

  public String getErrorMessage() {
    return errorMessage;
  }

  public void setErrorMessage(String errorMessage) {
    this.errorMessage = errorMessage;
  }

}