package com.bcx.plat.core.service.Impl;

import static com.bcx.plat.core.base.BaseConstants.STATUS_FAIL;
import static com.bcx.plat.core.base.BaseConstants.STATUS_SUCCESS;
import static com.bcx.plat.core.base.BaseConstants.TAKE_EFFECT;
import static com.bcx.plat.core.base.BaseConstants.UNAVAILABLE;

import com.bcx.plat.core.entity.BusinessObject;
import com.bcx.plat.core.mapper.BusinessObjectMapper;
import com.bcx.plat.core.service.BusinessObjectService;
import com.bcx.plat.core.utils.ServiceResult;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 业务对象业务层 Created by Went on 2017/8/1.
 */
@Service
@Transactional
public class BusinessObjectServiceImpl implements BusinessObjectService {

  @Autowired
  private BusinessObjectMapper businessObjectMapper;

  /**
   * 查询业务对象 输入空格分隔的查询关键字（对象代码、对象名称、关联表）
   */
  @Override
  public ServiceResult<BusinessObject> select(Map map) {
    try {
      if (map.size() != 0) {
        List<BusinessObject> select = businessObjectMapper.select(map);

        for (int i = 0; i < select.size(); i++) {
          String tableCname = select.get(i).getTableCname();
          String tableSchema = select.get(i).getTableSchema();
          String string = tableSchema + "(" + tableCname + ")";
          select.get(i).setTables(string);
          return new ServiceResult<>("消息查询成功", select);
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    return new ServiceResult<>("消息查询失败", "");
  }

  /**
   * 新增业务对象录入框，包括：对象代码，对象名称，关联表(单选)，版本(系统生成)
   */
  @Override
  public ServiceResult<BusinessObject> insert(BusinessObject businessObject) {
    try {
      //业务对象版本号默认从1.0开始
      businessObject.setVersion("1.0");
      businessObject.buildCreateInfo();
      //新增数默认状态为不可用
      businessObject.setStatus(UNAVAILABLE);
      String rowId = businessObject.getRowId();
      businessObjectMapper.insert(businessObject);
      //将用户新增的rowId返回
      return new ServiceResult<>("新增数据成功", rowId);
    } catch (Exception e) {
      e.printStackTrace();
      return new ServiceResult<>("新增数据失败", "");
    }
  }

  /**
   * 编辑对象名称字段
   */
  @Override
  public ServiceResult<BusinessObject> update(BusinessObject businessObject) {
    try {
      businessObject.buildModifyInfo();
      businessObjectMapper.update(businessObject);
      String rowId = businessObject.getRowId();
      return new ServiceResult<>("编辑数据成功", rowId);
    } catch (Exception e) {
      e.printStackTrace();
      return new ServiceResult<>("编辑数据失败", "");
    }
  }

  /**
   * 删除业务对象
   */
  @Override
  public ServiceResult<BusinessObject> delete(String rowId) {
    try {
      businessObjectMapper.delete(rowId);
      return new ServiceResult<>(STATUS_SUCCESS, "删除数据成功", "");
    } catch (Exception e) {
      e.printStackTrace();
    }
    return new ServiceResult<>(STATUS_FAIL, "删除数据失败", "");
  }

  /**
   * 获取ID对该条记录执行变更,没有生效的不能执行变更
   */
  @Override
  public ServiceResult updateExecuChange(String rowId) {
    BusinessObject select = businessObjectMapper.selectById(rowId);
    String status = select.getStatus();
    if (!(status == TAKE_EFFECT)) {
      return new ServiceResult("状态没有生效,不能执行变更", "");
    } else {
      businessObjectMapper.updateExecuChange(rowId);
      return new ServiceResult();
    }
  }
}
