package com.bcx.plat.core.service.Impl;

import static com.bcx.plat.core.utils.UtilsTool.collectToSet;

import com.bcx.plat.core.entity.MaintTableInfo;
import com.bcx.plat.core.mapper.MaintTableMapper;
import com.bcx.plat.core.service.MaintTableService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by Went on 2017/7/31.
 */
@Service
@Transactional
public class MaintTableServiceImpl implements MaintTableService {

  @Autowired
  private MaintTableMapper maintTableMapperImpl;

  /**
   * 维护数据库表查询
   *
   * @param str 根据条件查询
   */
  @Override
  public List selectMaint(String str) {
    try {
      if (str != null) {
        Map<String, Object> map = new HashMap<>();
        map.put("strArr", collectToSet(str));
        List<MaintTableInfo> maintTableInfos = maintTableMapperImpl.selectMaint(map);
        return maintTableInfos;
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    return null;
  }

  /**
   * 根据Id查询维护数据库字段
   */
  @Override
  public List<MaintTableInfo> selectById(String rowId) {
    try {
      if (rowId != null) {
        List<MaintTableInfo> maintTableInfos = maintTableMapperImpl.selectById(rowId);
        return maintTableInfos;
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    return null;
  }


}
