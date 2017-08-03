package com.bcx.plat.core.mapper;

import com.bcx.plat.core.base.BaseMapper;
import com.bcx.plat.core.entity.BusinessObject;
import org.apache.ibatis.annotations.Mapper;

/**
 * Created by Went on 2017/8/1.
 */
@Mapper
public interface BusinessObjectMapper extends BaseMapper<BusinessObject> {

  /**
   * 根据rowId删除数据
   */
  int delete(String rowId);

  /**
   * 获取ID对该条记录执行变更,没有生效的不能执行变更
   */
  int updateExecuChange(String rowId);

  /**
   * 根据id查询所有记录
   */
  BusinessObject selectById(String rowId);

}
