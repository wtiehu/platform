package com.bcx.plat.core.base.support;

import com.bcx.plat.core.entity.BusinessObject;
import com.bcx.plat.core.entity.BusinessObjectPro;
import com.bcx.plat.core.entity.SequenceRuleConfig;
import com.bcx.plat.core.manager.SequenceManager;
import com.bcx.plat.core.service.BusinessObjectProService;
import com.bcx.plat.core.service.BusinessObjectService;
import com.bcx.plat.core.service.SequenceRuleConfigService;
import com.bcx.plat.core.utils.SpringContextHolder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.bcx.plat.core.utils.UtilsTool.isValid;

/**
 * 实体类自动填充工具，该工具并不通用，目前不考虑做成接口
 * 这本就是一个很针对性的功能
 * <p>
 * 自动根据业务对象字段配置信息，对传入的 javaBean 做进行自动填充,目前支持的填充类型为流水号：
 * <p>
 * Create By HCL at 2017/9/19
 */
public abstract class EntityFillUtils {

  // 序列号类型
  private static final String SERIAL_TYPE = "sequenceRule";

  /**
   * 填充实体中的特殊字段
   *
   * @param entity        传入的实体
   * @param args          传入的参数
   * @param businessObjRI 业务对象的 RowId
   * @param forceFill     是否强制填充
   *                      强制填充的意思是，无论当前字段是否已经存在值，都直接填充并覆盖
   * @return 如果填充成功，则返回 true，否则返回 false
   */
  public static boolean fillEntity(BeanInterface entity, Map<String, Object> args, String businessObjRI, boolean forceFill) {
    if (null != entity && isValid(businessObjRI)) {
      Map entityMap = entity.toMap();
      if (null != entityMap) {
        Map<String, String> fieldNameInvoke = getFieldName(businessObjRI);
        // 查询规则配置
        List<BusinessObjectPro> objectPros = getBusinessProperties(businessObjRI);
        objectPros.forEach(businessObjectPro -> {
          // 根据属性进行操作,如果属性是序列号类型，开始执行填充
          if (SERIAL_TYPE.equals(businessObjectPro.getValueResourceType())) {
            Object value = entityMap.get(businessObjectPro.getPropertyCode());
            if (!isValid(value) || forceFill) {
              String sequenceCode = getSerialCodeByRowId(businessObjectPro.getValueResourceContent());
              if (null != sequenceCode) {
                value = SequenceManager.getInstance().buildSequenceNo(sequenceCode, args, entity);
                entityMap.put(fieldNameInvoke.get(businessObjectPro.getPropertyCode()), value);
              }
            }
          }
        });
        entity.fromMap(entityMap);
        return true;
      }
    }
    return false;
  }

  /**
   * 查询字段属性对应的名称
   *
   * @param businessObjRI 对象属性rowId主键
   * @return 返回查询结果
   */
  private static Map<String, String> getFieldName(String businessObjRI) {
    BusinessObjectProService service = SpringContextHolder.getBean(BusinessObjectProService.class);
    return service.obtainSequenceCode(businessObjRI);
  }

  /**
   * 根据序列号规则的 rowId 查询序列号规则的代码
   *
   * @param rowId 主键
   * @return 返回
   */
  private static String getSerialCodeByRowId(String rowId) {
    SequenceRuleConfigService service = SpringContextHolder.getBean(SequenceRuleConfigService.class);
    SequenceRuleConfig config = service.selectOneById(rowId);
    if (null != config) {
      return config.getRowId();
    }
    return null;
  }

  /**
   * 获取该业务对象配置下的属性
   *
   * @param businessObjRI 业务对象的 rowId
   * @return 返回信息
   */
  private static List<BusinessObjectPro> getBusinessProperties(String businessObjRI) {
    List<BusinessObjectPro> pros = new ArrayList<>();
    if (isValid(businessObjRI)) {
      BusinessObjectService service = SpringContextHolder.getBean(BusinessObjectService.class);
      // 由于版本的存在，该rowId对应的模版对象可能不是最新的
      BusinessObject object = service.getLatestEffectiveObj(businessObjRI);
      if (null != object) {
        return service.getObjProperties(object.getRowId());
      }
    }
    return pros;
  }

}