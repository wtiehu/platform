package com.bcx.plat.core.common;

import com.bcx.plat.core.base.BaseConstants;
import com.bcx.plat.core.base.BaseEntity;
import com.bcx.plat.core.base.BaseService;
import com.bcx.plat.core.constants.Message;
import com.bcx.plat.core.morebatis.DeleteAction;
import com.bcx.plat.core.morebatis.InsertAction;
import com.bcx.plat.core.morebatis.QueryAction;
import com.bcx.plat.core.morebatis.UpdateAction;
import com.bcx.plat.core.morebatis.cctv1.PageResult;
import com.bcx.plat.core.morebatis.mapper.SuitMapper;
import com.bcx.plat.core.morebatis.phantom.TableSource;
import com.bcx.plat.core.morebatis.substance.FieldCondition;
import com.bcx.plat.core.morebatis.substance.condition.Operator;
import com.bcx.plat.core.utils.ServiceResult;
import com.bcx.plat.core.utils.TableAnnoUtil;
import com.bcx.plat.core.utils.UtilsTool;
import java.lang.reflect.ParameterizedType;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;

public class BaseServiceTemplate<T extends BaseEntity<T>> implements BaseService<T> {

  private final Class entityClass = (Class) ((ParameterizedType) this.getClass()
      .getGenericSuperclass()).getActualTypeArguments()[0];
  private final Set<String> fieldNames = getFieldNamesFromClass(entityClass);
  private final TableSource table = TableAnnoUtil.getTableSource(entityClass);
  private final List<String> pkFields = TableAnnoUtil.getPkAnnoField(entityClass);

  @Autowired
  private SuitMapper suitMapper;

  public SuitMapper getSuitMapper() {
    return suitMapper;
  }

  public void setSuitMapper(SuitMapper suitMapper) {
    this.suitMapper = suitMapper;
  }

  public ServiceResult<PageResult<Map<String, Object>>> select(Map args, int pageNum, int pageSize) {
    args=mapFilter(args);
    QueryAction queryAction = new QueryAction().selectAll()
        .from(TableAnnoUtil.getTableSource(entityClass))
        .where(convertMapToFieldConditions(args));
    ServiceResult<PageResult<Map<String, Object>>> serviceResult;
    try {
      PageResult<Map<String, Object>> pageResult = queryAction
          .pageQuery(getSuitMapper(), pageNum, pageSize);
      serviceResult = new ServiceResult(BaseConstants.STATUS_SUCCESS, Message.QUERY_SUCCESS,
          underlineKeyMapListToCamel(pageResult));
    } catch (Exception e) {
      serviceResult = ServiceResult.Msg(BaseConstants.STATUS_FAIL, Message.QUERY_FAIL);
    }
    return serviceResult;
  }

  public ServiceResult<List<Map<String, Object>>> selectList(Map args) {
    args=mapFilter(args);
    QueryAction queryAction = new QueryAction().selectAll()
        .from(TableAnnoUtil.getTableSource(entityClass))
        .where(convertMapToFieldConditions(args));
    ServiceResult<List<Map<String, Object>>> serviceResult;
    try {
      List<Map<String, Object>> pageResult = getSuitMapper().select(queryAction);
      serviceResult = new ServiceResult<>(BaseConstants.STATUS_SUCCESS, Message.QUERY_SUCCESS,
          underlineKeyMapListToCamel(pageResult));
    } catch (Exception e) {
      serviceResult = ServiceResult.Msg(BaseConstants.STATUS_FAIL, Message.QUERY_FAIL);
    }
    return serviceResult;
  }


  public ServiceResult<PageResult<Map<String, Object>>> blankSelect(Collection<String> column,Collection<String> value, int pageNum, int pageSize) {
    QueryAction queryAction = new QueryAction().selectAll()
        .from(TableAnnoUtil.getTableSource(entityClass))
        .where(createBlankQuery(column,value));
    ServiceResult<PageResult<Map<String, Object>>> serviceResult;
    try {
      PageResult<Map<String, Object>> pageResult = queryAction.pageQuery(getSuitMapper(), pageNum, pageSize);
      serviceResult = new ServiceResult(BaseConstants.STATUS_SUCCESS, Message.QUERY_SUCCESS,
          underlineKeyMapListToCamel(pageResult));
    } catch (Exception e) {
      serviceResult = ServiceResult.Msg(BaseConstants.STATUS_FAIL, Message.QUERY_FAIL);
    }
    return serviceResult;
  }

  public ServiceResult<List<Map<String, Object>>> blankSelectList(Collection<String> column,Collection<String> value) {
    QueryAction queryAction = new QueryAction().selectAll()
        .from(TableAnnoUtil.getTableSource(entityClass))
        .where(createBlankQuery(column,value));
    ServiceResult<List<Map<String, Object>>> serviceResult;
    try {
      List<Map<String, Object>> pageResult = getSuitMapper().selectByOr(queryAction);
      serviceResult = new ServiceResult<>(BaseConstants.STATUS_SUCCESS, Message.QUERY_SUCCESS,
          pageResult.size()==0?null:underlineKeyMapListToCamel(pageResult));
    } catch (Exception e) {
      serviceResult = ServiceResult.Msg(BaseConstants.STATUS_FAIL, Message.QUERY_FAIL);
    }
    return serviceResult;
  }

  public ServiceResult<Map<String,Object>> insert(Map args) {
    args=mapFilter(args);
    args.remove("etc");
    InsertAction insertAction = new InsertAction().into(table).cols(fieldNames).values(args);
    try {
      getSuitMapper().insert(insertAction);
    } catch (Exception e) {
      e.printStackTrace();
      return ServiceResult.Msg(BaseConstants.STATUS_FAIL,Message.NEW_ADD_FAIL);
    }
    return new ServiceResult<>(BaseConstants.STATUS_SUCCESS, Message.NEW_ADD_SUCCESS,args);
  }

  public ServiceResult<Map<String,Object>> update(Map args) {
    args=mapFilter(args);
    args.remove("etc");
    final Map<String,Object> finalCopy=args;
    UpdateAction updateAction = new UpdateAction()
        .from(table)
        .set(args)
        .where(pkFields.stream().map((pk) -> {
          return new FieldCondition(pk, Operator.EQUAL, finalCopy.get(pk));
        }).collect(Collectors.toList()));
    try {
      getSuitMapper().update(updateAction);
    } catch (Exception e) {
      e.printStackTrace();
      return ServiceResult.Msg(BaseConstants.STATUS_FAIL, Message.UPDATE_FAIL);
    }
    return new ServiceResult<>(BaseConstants.STATUS_SUCCESS, Message.UPDATE_SUCCESS,args);
  }

  public ServiceResult<Object> delete(Map args) {
    args=mapFilter(args);
    args.remove("etc");
    DeleteAction deleteAction = new DeleteAction()
        .from(table)
        .where(convertMapToFieldConditions(args));
    try {
      getSuitMapper().delete(deleteAction);
    } catch (Exception e) {
      e.printStackTrace();
      return ServiceResult.Msg(BaseConstants.STATUS_FAIL, Message.DELETE_FAIL);
    }
    return ServiceResult.Msg(BaseConstants.STATUS_SUCCESS, Message.DELETE_SUCCESS);
  }

  protected List<FieldCondition> convertMapToFieldConditions(Map<String, Object> args) {
    return args.entrySet().stream().filter((entry) -> {
      final String key = entry.getKey();
      final Object value = entry.getValue();
      return fieldNames.contains(key);
    }).map((entry) -> {
      final Object value = entry.getValue();
      if (value instanceof Collection) {
        return new FieldCondition(entry.getKey(), Operator.IN, value);
      } else {
        return new FieldCondition(entry.getKey(), Operator.EQUAL, value);
      }
    }).collect(Collectors.toList());
  }

  protected List<FieldCondition> createBlankQuery(Collection<String> columns,Collection<String> values) {
    List<FieldCondition> conditions=new LinkedList<>();
    for (String column : columns) {
      for (String value : values) {
        conditions.add(new FieldCondition(column,Operator.LIKE_FULL,value));
      }
    }
    return conditions;
  }

  private PageResult<Map<String,Object>> underlineKeyMapListToCamel(PageResult<Map<String,Object>> origin){
    origin.setResult(underlineKeyMapListToCamel(origin.getResult()));
    return origin;
  }

  private List<Map<String,Object>> underlineKeyMapListToCamel(List<Map<String,Object>> origin){
    return origin.stream().map((row)->{
      HashMap<String,Object> out=new HashMap<>();
      for (Entry<String, Object> entry : row.entrySet()) {
        out.put(UtilsTool.underlineToCamel(entry.getKey(),false),entry.getValue());
      }
      return out;
    }).collect(Collectors.toList());
  }

  private Map<String,Object> mapFilter(Map<String,Object> map){
    return mapFilter(map,isRemoveNull(),isRemoveBlank());
  }

  private Map<String,Object> mapFilter(Map<String,Object> map,boolean removeNull,boolean removeBlank){
    Map<String,Object> outputMap=new HashMap<>();
    if (removeBlank==false&&removeNull==false) return outputMap;
    for (Entry<String, Object> entry : map.entrySet()) {
      Object value=entry.getValue();
      if (value==null&&removeNull) continue;
      if (value.equals("")&&removeBlank) continue;
      outputMap.put(entry.getKey(),entry.getValue());
    }
    return outputMap;
  }

  private Set<String> getFieldNamesFromClass(Class clz) {
    HashSet<String> result = new HashSet<>();
    while (clz != Object.class) {
      result.addAll(Arrays.stream(clz.getDeclaredFields()).map((field -> field.getName())).collect(
          Collectors.toList()));
      clz = clz.getSuperclass();
    }
    result.remove("etc");
    return result;
  }

  public boolean isRemoveBlank() {
    return true;
  }

  private boolean isRemoveNull() {
    return true;
  }
}
