package com.bcx.plat.core.controller;

import com.bcx.plat.core.base.BaseController;
import com.bcx.plat.core.constants.Message;
import com.bcx.plat.core.entity.DBTableColumn;
import com.bcx.plat.core.morebatis.component.Order;
import com.bcx.plat.core.service.DBTableColumnService;
import com.bcx.plat.core.utils.PlatResult;
import com.bcx.plat.core.utils.ServerResult;
import com.bcx.plat.core.utils.UtilsTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import static com.bcx.plat.core.constants.Global.PLAT_SYS_PREFIX;

/**
 * Create By HCL at 2017/8/1
 */
@RestController
@RequestMapping(PLAT_SYS_PREFIX + "/core/dbTableColumn")
public class DBTableColumnController extends BaseController {
  @Autowired
  private DBTableColumnService dbTableColumnService;


  protected List<String> blankSelectFields() {
    return Arrays.asList("columnEname", "columnCname");
  }


  /**
   * 通过表信息字段rowId查询表信息并分页显示
   *
   * @param search   按照空格查询
   * @param rowId    接受rowId
   * @param pageNum  当前第几页
   * @param pageSize 一页显示多少条
   * @return PlatResult
   */
  @RequestMapping("/queryPageById")
  public PlatResult queryPageById(String search, String rowId, String param, Integer pageNum, Integer pageSize, String order) {
    LinkedList<Order> orders = UtilsTool.dataSort(DBTableColumn.class, order);
    if (UtilsTool.isValid(rowId)) {
      ServerResult serverResult = dbTableColumnService.queryPageById(search, param, rowId, orders, pageNum, pageSize);
      return result(serverResult);
    }
    return error(Message.QUERY_FAIL);
  }

  /**
   * 根据表信息的rowId来查询表字段中的信息
   *
   * @param search 按照空格查询
   * @return PlatResult
   */
  @RequestMapping("/queryTabById")
  public Object singleInputSelect(String search, String rowId) {
    if (UtilsTool.isValid(rowId)) {
      ServerResult serverResult = dbTableColumnService.queryTableById(rowId, search);
      return successData(Message.QUERY_SUCCESS,serverResult);
    } else {
      return error(Message.QUERY_FAIL);
    }
  }

  /**
   * 新增表信息字段属性
   *
   * @param param 接受实体参数
   * @return Map
   */
  @PostMapping(value = "/add")
  public PlatResult addMaintDB(@RequestParam Map<String, Object> param) {
    ServerResult serverResult = dbTableColumnService.addTableColumn(param);
    return result(serverResult);
  }


  /**
   * 编辑业务对象属性
   *
   * @param param 实体参数
   * @return Map
   */
  @PostMapping(value = "/modify")
  public PlatResult modifyBusinessObjPro(@RequestParam Map<String, Object> param) {
    if (UtilsTool.isValid(param.get("rowId"))) {
      ServerResult serverResult = dbTableColumnService.updateTableColumn(param);
      return result(serverResult);
    } else {
      return error(Message.PRIMARY_KEY_CANNOT_BE_EMPTY);
    }
  }


  /**
   * 通用删除方法
   *
   * @param rowId 按照rowId查询
   * @return serviceResult
   */
  @PostMapping("/delete")
  public Object delete(String rowId) {
    if (UtilsTool.isValid(rowId)) {
      ServerResult delete = dbTableColumnService.delete(rowId);
      return result(delete);
    } else {
      return error(Message.PRIMARY_KEY_CANNOT_BE_EMPTY);
    }
  }

}