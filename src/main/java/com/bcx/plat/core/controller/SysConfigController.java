package com.bcx.plat.core.controller;

import com.bcx.plat.core.base.BaseConstants;
import com.bcx.plat.core.base.BaseController;
import com.bcx.plat.core.constants.Message;
import com.bcx.plat.core.entity.SysConfig;
import com.bcx.plat.core.morebatis.builder.ConditionBuilder;
import com.bcx.plat.core.morebatis.cctv1.PageResult;
import com.bcx.plat.core.morebatis.component.Order;
import com.bcx.plat.core.morebatis.phantom.Condition;
import com.bcx.plat.core.service.SysConfigService;
import com.bcx.plat.core.utils.PlatResult;
import com.bcx.plat.core.utils.ServerResult;
import com.bcx.plat.core.utils.UtilsTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import static com.bcx.plat.core.constants.Global.PLAT_SYS_PREFIX;
import static com.bcx.plat.core.utils.UtilsTool.dataSort;
import static org.springframework.web.bind.annotation.RequestMethod.POST;


/**
 * 系统资源配置controller层
 * Created by Wen Tiehu on 2017/8/4.
 */
@RestController
@RequestMapping(PLAT_SYS_PREFIX + "/core/sysConfig")
public class SysConfigController extends BaseController {

  @Autowired
  SysConfigService sysConfigService;

  protected List<String> blankSelectFields() {
    return Arrays.asList("confKey", "confValue");
  }

  /**
   * 系统资源配置查询方法
   *
   * @param search   按照空格查询
   * @param param    按照指定字段查询
   * @param pageNum  当前第几页
   * @param pageSize 一页显示多少条
   * @param order    排序方式
   * @return PlatResult
   */
  @RequestMapping("/queryPage")
  public PlatResult singleInputSelect(String search, String param, Integer pageNum, Integer pageSize, String order) {
    LinkedList<Order> orders = dataSort(SysConfig.class, order);
    Condition condition;
    if (UtilsTool.isValid(param)) { // 判断是否有param参数，如果有，按照指定字段查询
      condition = UtilsTool.convertMapToAndConditionSeparatedByLike(SysConfig.class, UtilsTool.jsonToObj(param, Map.class));
    } else { // 如果没有param参数，则进行空格查询
      condition = !UtilsTool.isValid(search) ? null : UtilsTool.createBlankQuery(blankSelectFields(), UtilsTool.collectToSet(search));
    }

    PageResult<Map<String, Object>> result;
    if (UtilsTool.isValid(pageSize)) { // 判断分页查询
      result = sysConfigService.selectPageMap(condition, orders, pageNum, pageSize);
    } else {
      result = new PageResult(sysConfigService.selectMap(condition, orders));
    }
    return result(new ServerResult<>(result));
  }

  /**
   * 系统资源配置数据新增数据
   *
   * @param param 接受一个实体参数
   * @return 返回操作信息
   */
  @RequestMapping(value = "/add", method = POST)
  public PlatResult insert(@RequestParam Map<String, Object> param) {
    ServerResult serverResult = new ServerResult();
    String confKey = String.valueOf(param.get("confKey")).trim();
    param.put("confKey", confKey);
    if (UtilsTool.isValid(confKey)) {
      Condition condition = new ConditionBuilder(SysConfig.class).and().equal("confKey", confKey).endAnd().buildDone();
      List<SysConfig> select = sysConfigService.select(condition);
      if (select.size() == 0) {
        SysConfig sysConfig = new SysConfig().buildCreateInfo().fromMap(param);
        int insert = sysConfig.insert();
        if (insert != -1) {
          return super.result(new ServerResult<>(BaseConstants.STATUS_SUCCESS, Message.NEW_ADD_SUCCESS, sysConfig));
        }
        return super.result(serverResult.setStateMessage(BaseConstants.STATUS_FAIL, Message.NEW_ADD_FAIL));
      }
      return super.result(serverResult.setStateMessage(BaseConstants.STATUS_FAIL, Message.DATA_CANNOT_BE_DUPLICATED));
    }
    return super.result(serverResult.setStateMessage(BaseConstants.STATUS_FAIL, Message.DATA_CANNOT_BE_EMPTY));
  }

  /**
   * 系统资源配置根据rowId修改数据
   *
   * @param param 接受一个实体参数
   * @return 返回操作信息
   */
  @RequestMapping(value = "/modify", method = POST)
  public PlatResult update(@RequestParam Map<String, Object> param) {
    if (UtilsTool.isValid(param.get("rowId"))) {
      ServerResult serverResult = new ServerResult();
      String confKey = String.valueOf(param.get("confKey")).trim();
      param.put("confKey", confKey);
      if (UtilsTool.isValid(confKey)) {
        Condition condition = new ConditionBuilder(SysConfig.class).and().equal("confKey", confKey).endAnd().buildDone();
        List<SysConfig> select = sysConfigService.select(condition);
        if (select.size() == 0 || select.get(0).getRowId().equals(param.get("rowId"))) {
          SysConfig sysConfig = new SysConfig();
          SysConfig modify = sysConfig.fromMap(param).buildModifyInfo();
          int update = modify.updateById();
          if (update != -1) {
            return super.result(new ServerResult<>(BaseConstants.STATUS_SUCCESS, Message.UPDATE_SUCCESS, modify));
          } else {
            return super.result(new ServerResult().setStateMessage(BaseConstants.STATUS_FAIL, Message.UPDATE_FAIL));
          }
        } else {
          return super.result(serverResult.setStateMessage(BaseConstants.STATUS_FAIL, Message.DATA_CANNOT_BE_DUPLICATED));
        }
      } else {
        return super.result(serverResult.setStateMessage(BaseConstants.STATUS_FAIL, Message.DATA_CANNOT_BE_EMPTY));
      }
    } else {
      return super.result(new ServerResult().setStateMessage(BaseConstants.STATUS_FAIL, Message.PRIMARY_KEY_CANNOT_BE_EMPTY));
    }
  }

  /**
   * 根据系统资源配置rowId删除当前数据
   *
   * @param rowId 业务对象rowId
   * @return PlatResult
   */
  @RequestMapping(value = "/delete", method = POST)
  public PlatResult delete(String rowId) {
    Condition condition = new ConditionBuilder(SysConfig.class).and().equal("rowId", rowId).endAnd().buildDone();
    List<Map> maps = sysConfigService.selectMap(condition);
    if (UtilsTool.isValid(rowId)) {
      SysConfig sysConfig = new SysConfig();
      int del = sysConfig.deleteById(rowId);
      if (del != -1) {
        return super.result(new ServerResult<>(BaseConstants.STATUS_SUCCESS, Message.DELETE_SUCCESS, maps));
      } else {
        return super.result(new ServerResult().setStateMessage(BaseConstants.STATUS_FAIL, Message.DELETE_FAIL));
      }
    } else {
      return super.result(new ServerResult().setStateMessage(BaseConstants.STATUS_FAIL, Message.PRIMARY_KEY_CANNOT_BE_EMPTY));
    }
  }
}
