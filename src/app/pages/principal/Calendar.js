import * as React from "react";
import moment from "moment-timezone";

/**
 * Color styles
 */
import { getInitLayoutConfig } from "./../../../_metronic/layout/_core/LayoutConfig";

/**
 * Components
 */

import {
  ViewState,
  GroupingState,
  IntegratedGrouping,
} from "@devexpress/dx-react-scheduler";
import { connectProps } from "@devexpress/dx-react-core";

import { Table, FCEHeader, CollapsibleTable } from "./../../components/index";

import {
  Scheduler,
  WeekView,
  Appointments,
  Toolbar,
  DateNavigator,
  AppointmentTooltip,
  GroupingPanel,
  Resources,
} from "@devexpress/dx-react-scheduler-material-ui";

import {
  IconButton,
  Paper,
  Grid,
  Fab,
  Snackbar,
  Button,
  FormGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Switch,
  ListItemText,
  Collapse,
  Checkbox,
  List,
  ListItem,
  Modal,
  Card,
  TextareaAutosize,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";

import { Autocomplete } from "@material-ui/lab";
import Alert from "@material-ui/lab/Alert";
import { withStyles, makeStyles, fade } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import Draggable from 'react-draggable';

/**
 * Icons
 */
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandLess from "@material-ui/icons/ExpandLess";
import { Lens, AccessTime } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";

import classNames from "clsx";

/**
 * Colors
 */
import { blue } from "@material-ui/core/colors";

/**
 * Services
 */
import { backoffice_service } from "./../../services/http/requests/index";
import auth from "./../../services/auth";
import roles from "./../../utils/roles";
import typesMemo from "../../utils/typesMemo";
import validator from "./../../services/validation";

/**
 * Utils
 */
import { getLang } from "./../../../_metronic/i18n/index";
const { selectedLang } = getLang();
const language = require(`./../../../_metronic/i18n/messages/${selectedLang}.json`);

/**
 * Control vars
 */
var tooltipClassData;
var studentSelected;
var typeConfirm;
const formInitData = {
  id: {
    error: false,
    msj: "",
    data: "",
    type: [],
  },
  init: {
    error: false,
    msj: "",
    data: "",
    type: ["required"],
  },
  end: {
    error: false,
    msj: "",
    data: "",
    type: ["required"],
  },
  lesson: {
    error: false,
    msj: "",
    data: null,
    type: ["required"],
  },
  teacher: {
    error: false,
    msj: "",
    data: null,
    type: ["required"],
  },
  url: {
    error: false,
    msj: "",
    data: "",
    type: ["required"],
  },
  students: {
    error: false,
    msj: "",
    data: [],
    label: "estudiante",
    type: ["length:1"],
  },
  type: {
    error: false,
    msj: "",
    data: false,
    type: [""],
  },
  vocabulary_learned: {
    error: false,
    msj: "",
    data: "",
    type: ["required"],
  },
  sentences_learned: {
    error: false,
    msj: "",
    data: "",
    type: ["required"],
  },
  comments: {
    error: false,
    msj: "",
    data: "",
    type: ["required"],
  }
};

const priorities = [
  { id: 1, text: language['DASHBOARD.CONTENT.CALENDAR.TITLE'], color: blue },
  // { id: 2, text: 'Disponibilidad semanal', color: deepOrange }
];

const grouping = [
  {
    resourceName: "priorityId",
  },
];

const filterTasks = (items, priorityId) =>
  items.filter((task) => !priorityId || task.priorityId === priorityId);

const styles = (theme) => ({
  card: {
    width: "100%"
  },
  flexibleSpace: {
    margin: "0 auto 0 0",
  },
  list_collapse: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  prioritySelector: {
    marginLeft: theme.spacing(2),
    minWidth: 140,
    "@media (max-width: 500px)": {
      minWidth: 0,
      fontSize: "0.75rem",
      marginLeft: theme.spacing(0.5),
    },
  },
  textField: {
    width: "100%",
  },
  modal: {
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  addButton: {
    position: "absolute",
    bottom: theme.spacing(1) * 3,
    right: theme.spacing(1) * 4,
  },
  commandButton: {
    backgroundColor: "rgba(255,255,255,0.65)",
  },
});

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: getInitLayoutConfig().js.colors.theme.base.primary,
      "& + $track": {
        opacity: 1,
        color: theme.palette.common.white,
        backgroundColor: getInitLayoutConfig().js.colors.theme.base.white,
        borderColor: getInitLayoutConfig().js.colors.theme.base.white,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {
    backgroundColor: getInitLayoutConfig().js.colors.theme.base.white,
    borderColor: getInitLayoutConfig().js.colors.theme.base.white,
    color: getInitLayoutConfig().js.colors.theme.base.white,
  },
}))(Switch);

const useTooltipContentStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(3, 1),
    paddingTop: 0,
    backgroundColor: theme.palette.background.paper,
    boxSizing: "border-box",
    width: "400px",
  },
  contentContainer: {
    paddingBottom: theme.spacing(1.5),
  },
  text: {
    ...theme.typography.body2,
    display: "inline-block",
  },
  title: {
    ...theme.typography.h6,
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightBold,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "normal",
  },
  icon: {
    verticalAlign: "middle",
  },
  contentItemIcon: {
    textAlign: "center",
  },
  grayIcon: {
    color: theme.palette.action.active,
  },
  colorfulContent: {
    color: ({ color }) => color[300],
  },
  lens: {
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    verticalAlign: "super",
  },
  textCenter: {
    textAlign: "center",
  },
  dateAndTitle: {
    lineHeight: 1.1,
  },
  titleContainer: {
    paddingBottom: theme.spacing(2),
  },
  container: {
    paddingBottom: theme.spacing(1.5),
  },
}));

const groupingStyles = ({ spacing }) => ({
  ...priorities.reduce(
    (acc, priority) => ({
      ...acc,
      [`cell${priority.text.replace(" ", "")}`]: {
        backgroundColor: fade(priority.color[400], 0.1),
        "&:hover": {
          backgroundColor: fade(priority.color[400], 0.15),
        },
        "&:focus": {
          backgroundColor: fade(priority.color[400], 0.2),
        },
      },
      [`headerCell${priority.text.replace(" ", "")}`]: {
        backgroundColor: fade(priority.color[400], 0.1),
        "&:hover": {
          backgroundColor: fade(priority.color[400], 0.1),
        },
        "&:focus": {
          backgroundColor: fade(priority.color[400], 0.1),
        },
      },
    }),
    {}
  ),
  icon: {
    paddingLeft: spacing(1),
    verticalAlign: "middle",
  },
});

const WeekViewTimeTableCell = withStyles(groupingStyles, {
  name: "WeekViewTimeTableCell",
})(({ groupingInfo, classes, ...restProps }) => {
  const groupId = groupingInfo[0].id;
  return (
    <WeekView.TimeTableCell
      className={classNames({
        [classes.cellLowPriority]: groupId === 1,
        [classes.cellMediumPriority]: groupId === 2,
        [classes.cellHighPriority]: groupId === 3,
      })}
      groupingInfo={groupingInfo}
      {...restProps}
    />
  );
});

const WeekViewDayScaleCell = withStyles(groupingStyles, {
  name: "WeekViewDayScaleCell",
})(({ groupingInfo, classes, ...restProps }) => {
  const groupId = groupingInfo[0].id;
  return (
    <WeekView.DayScaleCell
      className={classNames({
        [classes.headerCellLowPriority]: groupId === 1,
        [classes.headerCellMediumPriority]: groupId === 2,
        [classes.headerCellHighPriority]: groupId === 3,
      })}
      groupingInfo={groupingInfo}
      {...restProps}
    />
  );
});

const GroupingPanelCell = withStyles(groupingStyles, {
  name: "GroupingPanelCell",
})(({ group, classes, ...restProps }) => {
  const groupId = group.id;
  return (
    <GroupingPanel.Cell
      className={classNames({
        [classes.headerCellLowPriority]: groupId === 1,
        [classes.headerCellMediumPriority]: groupId === 2,
        [classes.headerCellHighPriority]: groupId === 3,
      })}
      group={group}
      {...restProps}
    ></GroupingPanel.Cell>
  );
});

const FlexibleSpace = withStyles(styles, {
  name: "FlexibleSpace",
})(({ classes, priority, priorityChange, ...restProps }) => (
  <Toolbar.FlexibleSpace
    {...restProps}
    className={classes.flexibleSpace}
  ></Toolbar.FlexibleSpace>
));

const Appointment = ({ children, ...restProps }) => {
  const { props } = children[1];
  if (props.data.state)
    var background = getInitLayoutConfig().js.colors.theme.base.primary;
  else var background = getInitLayoutConfig().js.colors.theme.base.secondary;

  return (
    <Appointments.Appointment
      {...restProps}
      style={{
        backgroundColor: background,
        borderRadius: "8px",
      }}
      className={"p-2 text-white"}
    >
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          {props.data.state ? (
            <span>
              {props.data.title.length <= 10
                ? props.data.title
                : `${props.data.title.substring(0, 10)}...`}
            </span>
          ) : (
              <span><FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.CANCELED"></FormattedMessage></span>
            )}
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} className={"text-right"}>
          {props.data.state ? (
            props.data.students.map((el, index) => (
              <i
                key={`icon-appointment-${index}`}
                className={"flaticon2-user text-white"}
                style={{ fontSize: 12 }}
              ></i>
            ))
          ) : (
              <></>
            )}
        </Grid>
      </Grid>
    </Appointments.Appointment>
  );
};

const TooltipContent = ({
  appointmentData,
  formatDate,
  appointmentResources,
}) => {
  const resource = appointmentResources[0];
  const classes = useTooltipContentStyles({ color: resource.color });
  return (
    <div
      className={classes.content}
      key={`${resource.fieldName}_${resource.id}_${appointmentData.id}`}
    >
      <Grid
        container
        alignItems="flex-start"
        className={classes.titleContainer}
      >
        <Grid item xs={2} className={classNames(classes.textCenter)}>
          <Lens className={classNames(classes.lens, classes.colorfulContent)} />
        </Grid>
        <Grid item xs={10}>
          <div>
            <div className={classNames(classes.title, classes.dateAndTitle)}>
              {appointmentData.title}
            </div>
            <div className={classNames(classes.text, classes.dateAndTitle)}>
              {formatDate(appointmentData.startDate, {
                day: "numeric",
                weekday: "long",
              })}
            </div>
          </div>
        </Grid>
      </Grid>
      {appointmentData.state ? (
        <>
          <Grid
            container
            alignItems="center"
            className={classes.contentContainer}
          >
            <Grid item xs={2} className={classes.textCenter}>
              <AccessTime className={classes.icon} />
            </Grid>
            <Grid item xs={10}>
              <div className={classes.text}>
                {`${formatDate(appointmentData.startDate, {
                  hour: "numeric",
                  minute: "numeric",
                })}
              - ${formatDate(appointmentData.endDate, {
                  hour: "numeric",
                  minute: "numeric",
                })}`}
                <a
                  href="#"
                  className={"ml-2"}
                  onClick={() => {
                    tooltipClassData = appointmentData;
                    document.getElementById("button-show-detail-class").click();
                  }}
                >
                  <i className={"fas fa-eye text-purple"}></i>
                </a>
              </div>
            </Grid>
            <Grid item xs={2} className={classes.textCenter}></Grid>
            <Grid item xs={10}>
              <div className={classes.text}>
                <a href={appointmentData.url} target="_blank">
                  {appointmentData.url}
                </a>
              </div>
            </Grid>
          </Grid>
          <Grid container alignItems="center">
            <Grid
              className={classNames(
                classes.contentItemIcon,
                classes.icon,
                classes.colorfulContent
              )}
              item
              xs={2}
            >
              LT
            </Grid>
            <Grid item xs={10}>
              <span
                className={classNames(classes.text, classes.colorfulContent)}
              >
                {moment().format("YYYY-MM-DD h:mm A")}
              </span>
            </Grid>
            <Grid
              className={classNames(
                classes.contentItemIcon,
                classes.icon,
                classes.colorfulContent
              )}
              item
              xs={2}
            >
              CT
            </Grid>
            <Grid item xs={10}>
              <span
                className={classNames(classes.text, classes.colorfulContent)}
              >
                {moment()
                  .tz("America/Bogota")
                  .format("YYYY-MM-DD h:mm A")}
              </span>
            </Grid>
          </Grid>
          <Grid container alignItems="center" className={"mt-2"}>
            {
              roles[auth.getUserInfo().user.role.name] === roles.ROLE_ADMIN ||
                roles[auth.getUserInfo().user.role.name] === roles.ROLE_USER ? (
                  <Grid
                    item
                    xs={12}
                  >
                    <Grid container alignItems="center">
                      <Grid
                        className={classNames(
                          classes.contentItemIcon,
                          classes.icon,
                          classes.colorfulContent
                        )}
                        item
                        xs={2}
                      >
                        <span>Pr</span>
                      </Grid>
                      <Grid item xs={10}>
                        <span>{appointmentData.teacher.first_name} {appointmentData.teacher.last_name}</span>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : (<></>)
            }
            {appointmentData.students.map((el, index) => (
              <Grid
                item
                xs={12}
                key={`container-tooltip-appointment-${appointmentData.id}-${index}`}
              >
                <Grid container alignItems="center">
                  <Grid
                    className={classNames(
                      classes.contentItemIcon,
                      classes.icon,
                      classes.colorfulContent
                    )}
                    item
                    xs={2}
                  >
                    <i
                      className={"flaticon2-user text-purple"}
                      style={{ fontSize: 12 }}
                    ></i>
                  </Grid>
                  <Grid item xs={10}>
                    {`${el.user.first_name} ${el.user.last_name}`}
                    {
                      roles[auth.getUserInfo().user.role.name] === roles.ROLE_TEACHER ? (
                        <a
                          href="#"
                          className={"ml-2"}
                          onClick={() => {
                            tooltipClassData = appointmentData;
                            studentSelected = el;
                            document.getElementById("button-make-notification-missing-student").click();
                          }}
                        >
                          <i className={"fas fa-times text-purple"}></i>
                        </a>
                      ) : (<></>)
                    }
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
          <></>
        )}
    </div>
  );
};

const Header = withStyles(styles, { name: "Header" })(
  ({ children, appointmentData, classes, ...restProps }) => (
    <AppointmentTooltip.Header {...restProps} appointmentData={appointmentData}>
      {
        appointmentData.state ? (
          roles[auth.getUserInfo().user.role.name] === roles.ROLE_ADMIN ||
            roles[auth.getUserInfo().user.role.name] === roles.ROLE_TEACHER ? (
              <IconButton
                onClick={() => {
                  tooltipClassData = appointmentData;
                  document.getElementById("button-edit-class").click();
                }}
                className={classes.commandButton}
              >
                <i className="flaticon-edit"></i>
              </IconButton>
            ) : (
              <></>
            )
        ) : (
            <></>
          )
      }
    </AppointmentTooltip.Header>
  )
);

class Calendar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentDate: moment()
        .tz("America/Bogota")
        .format("YYYY-MM-DD"),
      currentViewName: "Semana",
      typeFormModal: null,
      data: [],
      lessons: [],
      lessonByStudent: [],
      teachers: [],
      students: [],
      allStudents: [],
      currentPriority: 0,
      stateClass: false,
      openModal: false,
      openConfirm: false,
      byStudent: true,
      formData: { ...formInitData },
      memos: {
        headers: [
          {
            name: (<FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.SHOW.MEMOS.TABLE.DATE"></FormattedMessage>)
          },
          {
            name: (<FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.SHOW.MEMOS.TABLE.STUDENT"></FormattedMessage>)
          },
          {
            name: (<FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.SHOW.MEMOS.TABLE.ACTIONS"></FormattedMessage>)
          }
        ],
        body: []
      },
      materials: {
        headers: [
          {
            name: (<FormattedMessage id="DASHBOARD.CONTENT.MATERIALS.LIST.TABLE.NAME"></FormattedMessage>)
          },
          {
            name: (<FormattedMessage id="DASHBOARD.CONTENT.MATERIALS.LIST.TABLE.LESSON"></FormattedMessage>)
          },
          {
            name: (<FormattedMessage id="DASHBOARD.CONTENT.MATERIALS.LIST.TABLE.MATERIAL"></FormattedMessage>)
          }
        ],
        body: []
      },
      collapse: {
        type_one: false,
        type_two: false,
      },
      snackbar: {
        status: false,
        code: "",
        message: "",
      },
      resources: [
        {
          fieldName: "priorityId",
          title: "Priority",
          instances: priorities,
        },
      ],
    };

    /**
     * Handlers
     *
     */

    this.initData = () => {
      Object.entries(formInitData).forEach(([key, value]) => {
        if (typeof formInitData[key].data == "string")
          formInitData[key].data = "";
        else if (typeof formInitData[key].data == "object")
          if (formInitData[key].label === "estudiante")
            formInitData[key].data = [];
          else formInitData[key].data = null;
      });
      this.setState({ formData: { ...formInitData } });
    }

    this.currentViewNameChange = (currentViewName) => {
      this.setState({ currentViewName });
    };

    this.currentDateChange = (currentDate) => {
      this.setState({ currentDate });
      return this.getClasses();
    };

    this.priorityChange = (value) => {
      const { resources } = this.state;
      const nextResources = [
        {
          ...resources[0],
          instances: value > 0 ? [priorities[value - 1]] : priorities,
        },
      ];

      this.setState({ currentPriority: value, resources: nextResources });
    };

    this.handleChangeFormData = (property, value) => {
      const { formData } = this.state;
      const form_data_obj = { ...formData };
      form_data_obj[property].data = value;
      this.setState({ formData: { ...form_data_obj } });
    };

    this.handleChangeVocabularyLearned = (event) =>
      this.handleChangeFormData("vocabulary_learned", event.target.value);
    this.handleChangeSentencesLearned = (event) =>
      this.handleChangeFormData("sentences_learned", event.target.value);
    this.handleChangeComments = (event) =>
      this.handleChangeFormData("comments", event.target.value);
    this.handleChangeInit = (event, setEndToo = true) => {
      this.handleChangeFormData("init", event.target.value);
      const timezone = moment(event.target.value.replace('T', ' ')).tz("America/Bogota");
      const end = timezone.add(25, 'minutes').format("YYYY-MM-DDTHH:mm");
      if (setEndToo)
        this.handleChangeEnd({ target: { value: end } }, false);
    }
    this.handleChangeEnd = (event) =>
      this.handleChangeFormData("end", event.target.value);
    this.handleChangeUrl = (event) =>
      this.handleChangeFormData("url", event.target.value);
    this.handleChangeIdMemo = (id) =>
      this.handleChangeFormData("id", id);
    this.handleChangeType = (event) => {
      let type = event.currentTarget.getAttribute('data-type') === 'true';
      let edit = event.currentTarget.getAttribute('data-edit') === 'true';
      this.handleChangeFormData("type", type);
      if (!edit)
        document.getElementById('button-submit-save-memo').click();
      else
        document.getElementById('button-submit-edit-memo').click();
    }
    this.handleChangeLesson = async (event, value, setStudents = true) => {
      const token = auth.getToken();
      if (setStudents && value) {
        const response = await backoffice_service().getStudents(
          { token, page: 0 },
          { current_lesson: value.id }
        );
        if (response.error)
          return this.setState({
            snackbar: { status: true, code: "error", message: response.msj },
          });
        const data = [
          ...response.data.data.map((el) => {
            if (el.user.is_active)
              return {
                id: el.id,
                name: `${el.user.first_name} ${el.user.last_name}`,
                teacher: el.teacher,
                current_lesson: el.current_lesson
              };
          }),
        ];
        if (this.state.byStudent) this.setState({ allStudents: data });
        else this.setState({ students: data });
      }
      return this.handleChangeFormData("lesson", value);
    };
    this.handleChangeLessonMemo = async (event, value) => this.handleChangeLesson(event, value, false);
    this.handleChangeTeacher = (event, value) => {
      this.handleChangeFormData("teacher", value);
      this.handleChangeUrl({ target: { value: value ? value.link : "" || "" } })
    }
    this.verifyLengthStudentsArray = (students) => {
      if (students.length > 2) {
        this.setState({
          snackbar: {
            status: true,
            code: "error",
            message:
              (language["DASHBOARD.CONTENT.CALENDAR.CREATE.STUDENTS.ERROR"].replace('{max}', 2)),
          },
        });
      }
      return !(students.length > 2);
    }
    this.updatePreferedTeacher = (students) => {
      if (students.length >= 1) {
        const teacher = this.state.teachers.find((el) => el.id === students[students.length - 1].teacher);
        if (teacher) this.handleChangeTeacher(null, teacher);
      }
    }
    this.updateInfoListByStudent = async (student) => {
      return await this.handleChangeLesson(null, student.current_lesson);
    }
    this.handleChangeStudents = (event, value) => {
      const students = [...value];
      if (!this.verifyLengthStudentsArray(students)) return;
      this.updatePreferedTeacher(students);
      return this.handleChangeFormData("students", students);
    }
    this.handleChangeStudentsAll = async (event, value) => {
      const students = [...new Map([...value].map(item => [item.id, item])).values()];
      if (!this.verifyLengthStudentsArray(students)) return;
      this.updatePreferedTeacher(students);
      if (students.length === 1) await this.updateInfoListByStudent(students[0]);
      if (students.length === 0) await this.loadAllStudents();
      return this.handleChangeFormData("students", students);
    }
    this.handleChangeStudentsMemo = (event, value) => {
      if (!value) this.handleChangeStudents(event, []);
      else this.handleChangeStudents(event, [value]);
    }
    this.handleChangeStateClass = async () => {
      const token = auth.getToken();
      this.setState({ stateClass: true });
      const response = await backoffice_service().cancelClass({
        token,
        data: { id: tooltipClassData.id, state: false },
      });
      if (response.error) {
        this.setState({ stateClass: false });
        return this.setState({
          snackbar: { status: true, code: "error", message: response.msj },
        });
      }
      this.handleCloseModal();
      document
        .getElementsByClassName("MuiButtonBase-root MuiIconButton-root")[4]
        .click();
      this.setState({
        snackbar: {
          status: true,
          code: "success",
          message: (<FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.CANCEL.MESSAGE"></FormattedMessage>),
        },
      });
      return this.getClasses();
    }
    this.handleClickCollapse = (event) =>
      this.setState({
        collapse: {
          type_one:
            event.currentTarget.firstChild.getAttribute("type") === "one"
              ? !this.state.collapse.type_one
              : false,
          type_two:
            event.currentTarget.firstChild.getAttribute("type") === "two"
              ? !this.state.collapse.type_two
              : false,
        },
      });

    this.handleChangeTypeProgramming = async (state) => {
      this.initData();
      this.updateDatesInitEnd();
      this.setState({ byStudent: state });
      await this.loadAllStudents();
    }
    this.handleChangeTypeProgrammingStudent = (event) => this.handleChangeTypeProgramming(true);
    this.handleChangeTypeProgrammingLesson = (event) => this.handleChangeTypeProgramming(false);

    this.handleOpenModal = () => this.setState({ openModal: true });
    this.handleCloseModal = () => {
      tooltipClassData = null;
      this.setState({
        openModal: false,
        stateClass: false,
        collapse: {
          type_one: false,
          type_two: false,
        },
      });
    };
    this.handleCloseConfirmCancel = () =>
      this.setState({
        openConfirm: false
      });
    this.handleCloseConfirm = () => {
      const token = auth.getToken();
      const { formData } = this.state;
      const obj_data = {
        class_obj_id: tooltipClassData.id,
        student_class_id: formData.students.data[0].id,
        date: formData.init.data.replace("T", " "),
        vocabulary_learned: formData.vocabulary_learned.data,
        sentences_learned: formData.sentences_learned.data,
        comments: formData.comments.data,
        type: formData.type.data ? 'PUBLIC' : 'DRAFT'
      };
      if (typeConfirm === 'edit') {
        var i18n = "DASHBOARD.CONTENT.CALENDAR.CREATE.MEMOS.MESSAGES.EDIT";
        obj_data['id'] = formData.id.data;
      } else {
        var i18n = "DASHBOARD.CONTENT.CALENDAR.CREATE.MEMOS.MESSAGES.SUCCESS";
      }
      this.saveOrEditMemo(token, obj_data, i18n, typeConfirm);
    }
    this.handleCloseSnackbar = () =>
      this.setState({
        snackbar: {
          status: false,
          snackbar: "",
          message: "",
        },
      });

    this.handleEventModal = (type) => {
      this.setState({ typeFormModal: type });
      return this.handleOpenModal();
    };
    this.updateDatesInitEnd = () => {
      const timezone = moment().tz("America/Bogota");
      const init = timezone.format("YYYY-MM-DDTHH:mm");
      const end = timezone.add(25, 'minutes').format("YYYY-MM-DDTHH:mm");
      this.handleChangeInit({ target: { value: init } }, false);
      this.handleChangeEnd({ target: { value: end } }, false);
    }
    this.handleAddClass = () => {
      this.updateDatesInitEnd();
      return this.handleEventModal("add_class");
    };
    this.handleShowClassData = async () => {
      const token = auth.getToken();
      const response = await backoffice_service().getMaterials({ token, lesson_id: tooltipClassData.lesson.id, page: 0 }, { not_paginate: true });
      const response_memos = await backoffice_service().getMemos({ token, class_id: tooltipClassData.id });
      if (response.error)
        return this.setState({
          snackbar: { status: true, code: "error", message: response.msj },
        });
      if (response_memos.error)
        return this.setState({
          snackbar: { status: true, code: "error", message: response_memos.msj },
        });
      const arr_materials = { ...this.state.materials };
      const arr_memos = { ...this.state.memos };

      if (roles[auth.getUserInfo().user.role.name] === roles.ROLE_ADMIN)
        response_memos.data.data = response_memos.data.data.filter(el => typesMemo[el.type] === typesMemo.PUBLIC);

      if (roles[auth.getUserInfo().user.role.name] === roles.ROLE_USER)
        response_memos.data.data = response_memos.data.data.filter(el => typesMemo[el.type] === typesMemo.PUBLIC && el.student_class.student.user.id === (auth.getUserInfo()).user.id);

      arr_materials.body = response.data.data.map((el) => {
        return {
          content: [
            {
              name: 'name',
              value: el.name,
              action: null
            },
            {
              name: 'lesson',
              value: el.lesson ? el.lesson.title : null,
              action: null
            },
            {
              action: "href",
              value: el.url,
              text: (<FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.SHOW.MATERIALS.SHOW_MATERIAL"></FormattedMessage>)
            }
          ]
        }
      });

      if (roles[auth.getUserInfo().user.role.name] !== roles.ROLE_TEACHER)
        arr_memos.headers = arr_memos.headers.filter(el => (el.name !== 'Acciones' && el.name !== 'Actions'));

      arr_memos.body = response_memos.data.data.map((el) => {
        const content = [
          {
            name: 'date',
            value: el.date.replace('T', ' '),
            action: null
          },
          {
            name: 'student',
            value: `${el.student_class.student.user.first_name} ${el.student_class.student.user.last_name}`,
            action: null
          }
        ]
        if (roles[auth.getUserInfo().user.role.name] === roles.ROLE_TEACHER)
          if (typesMemo[el.type] === typesMemo.DRAFT)
            content.push({
              action: 'edit',
              value: el.id
            });
          else
            content.push({
              name: 'action',
              action: null,
              value: null
            });
        return {
          id: el.id,
          data: el,
          template: (
            <Card className={this.props.classes.card}>
              <CardContent>
                <h3><FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.VOCABULARY_LEARNED"></FormattedMessage></h3>
                <hr />
                <p>{el.vocabulary_learned}</p>
                <br />
                <h3><FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.SENTENCES_LEARNED"></FormattedMessage></h3>
                <hr />
                <p>{el.sentences_learned}</p>
                <br />
                <h3><FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.COMMENTS"></FormattedMessage></h3>
                <hr />
                <p>{el.comments}</p>
              </CardContent>
            </Card>
          ),
          content
        }
      });
      this.setState({ materials: { ...arr_materials }, memos: { ...arr_memos } });
      this.handleEventModal("class_data");
    };
    this.updateDataForEdit = async () => {
      const token = auth.getToken();
      const response_students = await backoffice_service().getClasses({ token, page: 0 }, { class_id: tooltipClassData.id });
      this.initData();
      if (response_students.error)
        return this.setState({
          snackbar: { status: true, code: "error", message: response_students.msj },
        });
      this.setState({
        students: [
          ...response_students.data.data.map((el) => {
            return {
              id: el.id,
              name: `${el.student.user.first_name} ${el.student.user.last_name}`,
            };
          }),
        ],
      });
    }
    this.handleEditClassData = async () => {
      await this.updateDataForEdit();
      this.handleChangeLessonMemo(null, tooltipClassData.lesson);
      this.handleEventModal("edit_class_data");
    };
    this.handleEditMemoData = async () => {
      this.handleEventModal("edit_memo_data");
    }
    this.handleSaveClass = async (event) => {
      event.preventDefault();
      const token = auth.getToken();
      const { formData } = this.state;
      delete formData['sentences_learned'];
      delete formData['vocabulary_learned'];
      delete formData['type'];
      delete formData['comments'];
      let error = false;
      this.setState({ formData: { ...validator(formData) } });
      Object.entries(this.state.formData).forEach(([key, value]) => {
        if (value.error) error = true;
      });
      if (error)
        return this.setState({
          snackbar: {
            status: true,
            code: "error",
            message: <FormattedMessage id="GENERAL.FORM.ERROR.ERRORS.TEXT"></FormattedMessage>,
          },
        });
      const response = await backoffice_service().createClass({
        token,
        data: {
          user_id: formData.teacher.data.id,
          lesson_id: formData.lesson.data.id,
          init: formData.init.data.replace("T", " "),
          end: formData.end.data.replace("T", " "),
          url: formData.url.data,
          students: formData.students.data,
        },
      });
      if (response.error)
        return this.setState({
          snackbar: { status: true, code: "error", message: response.msj },
        });
      this.setState({
        byStudent: true,
        snackbar: {
          status: true,
          code: "success",
          message: (<FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.CREATE.MESSAGES.SUCCESS"></FormattedMessage>),
        },
      });
      this.initData();
      this.handleCloseModal();
      return this.getClasses();
    };
    this.saveOrEditMemo = async (token, data, i18n, type) => {
      if (type == 'create') {
        var response = await backoffice_service().createMemo({
          token,
          data
        });
      } else {
        var response = await backoffice_service().editMemo({
          token,
          data
        });
      }
      if (response.error)
        return this.setState({
          openConfirm: false,
          snackbar: { status: true, code: "error", message: response.msj },
        });

      typeConfirm = null;
      this.initData();
      if (type == 'create') this.handleCloseModal();
      else document.getElementById('button-show-detail-class').click();

      this.setState({
        openConfirm: false,
        snackbar: {
          status: true,
          code: "success",
          message: (<FormattedMessage id={i18n}></FormattedMessage>),
        },
      });
    };
    this.handleCreateMemo = async (event) => {
      event.preventDefault();
      const token = auth.getToken();
      const { formData } = this.state;
      delete formData['end'];
      delete formData['teacher'];
      delete formData['url'];
      let error = false;
      this.setState({ formData: { ...validator(formData) } });
      Object.entries(this.state.formData).forEach(([key, value]) => {
        if (value.error) error = true;
      });
      if (error)
        return this.setState({
          snackbar: {
            status: true,
            code: "error",
            message: <FormattedMessage id="GENERAL.FORM.ERROR.ERRORS.TEXT"></FormattedMessage>,
          },
        });

      if (formData.type.data) {
        typeConfirm = "create";
        this.setState({
          openConfirm: true
        });
      } else {
        await this.saveOrEditMemo(token, {
          class_obj_id: tooltipClassData.id,
          student_class_id: formData.students.data[0].id,
          date: formData.init.data.replace("T", " "),
          vocabulary_learned: formData.vocabulary_learned.data,
          sentences_learned: formData.sentences_learned.data,
          comments: formData.comments.data,
          type: formData.type.data ? 'PUBLIC' : 'DRAFT'
        }, "DASHBOARD.CONTENT.CALENDAR.CREATE.MEMOS.MESSAGES.SUCCESS", "create");
      }
    };
    this.handleSaveEditMemo = async (event) => {
      event.preventDefault();
      const token = auth.getToken();
      const { formData } = this.state;
      delete formData['end'];
      delete formData['teacher'];
      delete formData['url'];
      let error = false;
      this.setState({ formData: { ...validator(formData) } });
      Object.entries(this.state.formData).forEach(([key, value]) => {
        if (value.error) error = true;
      });
      if (error)
        return this.setState({
          snackbar: {
            status: true,
            code: "error",
            message: <FormattedMessage id="GENERAL.FORM.ERROR.ERRORS.TEXT"></FormattedMessage>,
          },
        });

      if (formData.type.data) {
        typeConfirm = "edit";
        this.setState({
          openConfirm: true
        });
      } else {
        await this.saveOrEditMemo(token, {
          id: formData.id.data,
          class_obj_id: tooltipClassData.id,
          student_class_id: formData.students.data[0].id,
          date: formData.init.data.replace("T", " "),
          vocabulary_learned: formData.vocabulary_learned.data,
          sentences_learned: formData.sentences_learned.data,
          comments: formData.comments.data,
          type: formData.type.data ? 'PUBLIC' : 'DRAFT'
        }, "DASHBOARD.CONTENT.CALENDAR.CREATE.MEMOS.MESSAGES.EDIT", "edit");
      }
    };
    this.handleEditMemo = async (event) => {
      let id = parseInt(event.currentTarget.firstChild.firstChild.getAttribute('data-id'));
      const { memos } = this.state;
      const memo = memos.body.find(el => el.id === id);
      await this.updateDataForEdit();
      this.handleChangeIdMemo(id);
      this.handleChangeLessonMemo(null, tooltipClassData.lesson);
      this.handleChangeVocabularyLearned({ target: { value: memo.data.vocabulary_learned } });
      this.handleChangeSentencesLearned({ target: { value: memo.data.sentences_learned } });
      this.handleChangeComments({ target: { value: memo.data.comments } });
      this.handleChangeInit({ target: { value: memo.data.date } });
      this.handleChangeStudentsMemo(null, {
        id: memo.data.student_class.id,
        name: `${memo.data.student_class.student.user.first_name} ${memo.data.student_class.student.user.last_name}`,
      });
      document.getElementById('button-edit-memo').click();
    }
    this.handleCreateNotification = async () => {
      const token = auth.getToken();
      const response = await backoffice_service().createNotification({
        token,
        data: {
          class_id: tooltipClassData.id,
          title: "Inasistencia del estudiante",
          type: "PRIVATE",
          status: "SEND",
          to: studentSelected.user.email,
          template: "none",
          data: {
            type: "missing_student",
            student: `${studentSelected.user.first_name} ${studentSelected.user.last_name}`,
            lesson: tooltipClassData.lesson.title,
            date: tooltipClassData.init[0],
            time: tooltipClassData.init[1],
            url: "none",
            content: "Inasistencia"
          }
        },
      });
      if (response.error)
        return this.setState({
          snackbar: { status: true, code: "error", message: response.msj },
        });
      this.setState({
        snackbar: {
          status: true,
          code: "success",
          message: (<FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.NOTIFICATIONS.CREATED"></FormattedMessage>),
        },
      });
    }

    this.flexibleSpace = connectProps(FlexibleSpace, () => {
      const { currentPriority } = this.state;
      return {
        priority: currentPriority,
        priorityChange: this.priorityChange,
      };
    });
  }

  async getClasses() {
    const { currentDate } = this.state;
    const token = auth.getToken();
    const init = `${moment(currentDate)
      .subtract(4, "week")
      .format("YYYY-MM-DD")} 00:00:00`;
    const end = `${moment(currentDate)
      .add(4, "week")
      .format("YYYY-MM-DD")} 23:59:59`;
    const response = await backoffice_service().getClasses({
      token,
      init,
      end,
    });
    if (response.error)
      return this.setState({
        snackbar: { status: true, code: "error", message: response.msj },
      });
    var data = response.data.data
      .map((el) => el.class_obj)
      .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
      .map((el) => {
        el.students = response.data.data
          .map((el) => {
            return { student: el.student, class: el.class_obj.id };
          })
          .filter((element) => element.class === el.id)
          .map((el) => el.student);
        return el;
      });

    for (let i = 0; i < data.length; i++) {
      data[i].materials = (
        await backoffice_service().getMaterials(
          { token, lesson_id: data[i].lesson.id, page: 0 },
          { not_paginate: true }
        )
      ).data.data;
    }

    this.setState({
      data: [
        ...data.map((el) => {
          const init = el.init.split("T");
          const end = el.end.split("T");
          return {
            title: el.lesson ? el.lesson.title : null,
            priorityId: 1,
            state: el.state,
            startDate: new Date(
              init[0].split("-")[0],
              Number(init[0].split("-")[1]) - 1,
              init[0].split("-")[2],
              init[1].split(":")[0],
              init[1].split(":")[1]
            ),
            endDate: new Date(
              end[0].split("-")[0],
              Number(end[0].split("-")[1]) - 1,
              end[0].split("-")[2],
              end[1].split(":")[0],
              end[1].split(":")[1]
            ),
            init,
            end,
            url: el.url,
            materials: el.materials,
            lesson: el.lesson,
            students: el.students,
            teacher: el.user,
            id: el.id,
          };
        }),
      ],
    });
  }

  async loadData() {
    const token = auth.getToken();
    if (roles[auth.getUserInfo().user.role.name] === roles.ROLE_ADMIN) {
      const response_lessons = await backoffice_service().getLessons(
        { token },
        { not_paginate: true, many: true }
      );
      const response_teachers = await backoffice_service().getUsers(
        { token },
        { not_paginate: true, role_teacher: true }
      );
      if (response_lessons.error)
        return this.setState({
          snackbar: {
            status: true,
            code: "error",
            message: response_lessons.msj,
          },
        });
      if (response_teachers.error)
        return this.setState({
          snackbar: {
            status: true,
            code: "error",
            message: response_teachers.msj,
          },
        });
      this.setState({ lessons: response_lessons.data.data });
      this.setState({ teachers: [...response_teachers.data.data.filter((el) => el.is_active)] });
      await this.loadAllStudents();
    }
    return this.getClasses();
  }

  async loadAllStudents() {
    const token = auth.getToken();
    const response_students = await backoffice_service().getStudents({ token, page: 0 })
    if (response_students.error)
      return this.setState({
        snackbar: {
          status: true,
          code: "error",
          message: response_students.msj,
        },
      });
    this.setState({
      allStudents: [
        ...response_students.data.data.map((el) => {
          if (el.user.is_active)
            return {
              id: el.id,
              name: `${el.user.first_name} ${el.user.last_name}`,
              teacher: el.teacher,
              current_lesson: el.current_lesson
            };
        }),
      ],
    });
  }

  componentDidMount() {
    return this.loadData();
  }

  componentDidUpdate() {
    this.flexibleSpace.update();
  }

  render() {
    const {
      data,
      typeFormModal,
      currentDate,
      currentViewName,
      currentPriority,
      stateClass,
      resources,
      snackbar,
      openModal,
      openConfirm,
      lessons,
      lessonByStudent,
      teachers,
      byStudent,
      students,
      allStudents,
      collapse,
      formData,
      materials,
      memos
    } = this.state;
    const { classes } = this.props;

    return (
      <>
        <Dialog
          open={openConfirm}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.CONFIRM_PUBLIC"></FormattedMessage>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleCloseConfirmCancel}
              size="large"
              variant="contained"
              className="btn-primary h-35"
              type={"submit"}
            >
              <FormattedMessage id="GENERAL.FORM.ACTIONS.CANCEL"></FormattedMessage>
            </Button>
            <Button
              onClick={this.handleCloseConfirm}
              size="large"
              variant="contained"
              className="btn-primary h-35"
              type={"submit"}
            >
              <FormattedMessage id="GENERAL.FORM.ACTIONS.CONFIRM"></FormattedMessage>
            </Button>
          </DialogActions>
        </Dialog>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={openModal}
          onClose={this.handleCloseModal}
        >
          <div className={`${classes.modal} modal-file`}>
            <Grid container>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                {typeFormModal === "add_class" ? (
                  <div className={`card card-custom card-stretch gutter-b`}>
                    <FCEHeader
                      title={<FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.CREATE.TITLE"></FormattedMessage>}
                      subtitle={<FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.CREATE.SUBTITLE"></FormattedMessage>}
                    ></FCEHeader>
                    <div className="card-body pt-0 pb-3">
                      <div className="tab-content">
                        <form
                          noValidate
                          autoComplete="off"
                          onSubmit={this.handleSaveClass}
                        >
                          <Grid container>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <FormGroup row className="ml-3">
                                <FormControlLabel
                                  control={<Checkbox checked={byStudent} onChange={this.handleChangeTypeProgrammingStudent} />}
                                  label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.BY_STUDENT"></FormattedMessage>}
                                />
                                <FormControlLabel
                                  control={<Checkbox checked={!byStudent} onChange={this.handleChangeTypeProgrammingLesson} />}
                                  label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.BY_LESSON"></FormattedMessage>}
                                />
                              </FormGroup>
                            </Grid>

                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={6}
                              lg={6}
                              className="pt-2 pb-2 pl-2 pr-2"
                            >
                              <FormControl
                                component="fieldset"
                                className="wd-full"
                              >
                                <FormLabel component="legend">
                                  <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.CREATE.INIT_DATE"></FormattedMessage>
                                </FormLabel>
                                <TextField
                                  label=""
                                  variant="outlined"
                                  size="small"
                                  type="datetime-local"
                                  value={formData.init.data}
                                  error={formData.init.error}
                                  helperText={formData.init.msj}
                                  onChange={this.handleChangeInit}
                                  className={classes.textField}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={6}
                              lg={6}
                              className="pt-2 pb-2 pl-2 pr-2"
                            >
                              <FormControl
                                component="fieldset"
                                className="wd-full"
                              >
                                <FormLabel component="legend">
                                  <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.CREATE.END_DATE"></FormattedMessage>
                                </FormLabel>
                                <TextField
                                  label=""
                                  variant="outlined"
                                  size="small"
                                  type="datetime-local"
                                  value={formData.end.data}
                                  error={formData.end.error}
                                  helperText={formData.end.msj}
                                  onChange={this.handleChangeEnd}
                                  className={classes.textField}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              className="pt-2 pb-2 pl-2 pr-2"
                            >
                              <FormControl
                                component="fieldset"
                                className="wd-full"
                              >
                                <FormLabel component="legend">
                                  <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.CREATE.STUDENTS"></FormattedMessage>
                                </FormLabel>
                                <Autocomplete
                                  multiple
                                  id="tags-outlined"
                                  options={byStudent ? allStudents : students}
                                  getOptionLabel={(option) =>
                                    option.name ? option.name : ""
                                  }
                                  size={"small"}
                                  value={formData.students.data}
                                  onChange={byStudent ? this.handleChangeStudentsAll : this.handleChangeStudents}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="outlined"
                                      label=""
                                      placeholder={language['DASHBOARD.CONTENT.CALENDAR.CREATE.STUDENTS.LABEL'].replace('{max}', 2)}
                                      size="medium"
                                      error={formData.students.error}
                                      helperText={formData.students.msj}
                                    />
                                  )}
                                />
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={6}
                              lg={6}
                              className="pt-2 pb-2 pl-2 pr-2"
                            >
                              <FormControl
                                component="fieldset"
                                className="wd-full"
                              >
                                <FormLabel component="legend">
                                  <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.CREATE.LESSON"></FormattedMessage>
                                </FormLabel>
                                <Autocomplete
                                  options={byStudent ? lessonByStudent : lessons}
                                  getOptionLabel={(option) =>
                                    option.title ? option.title : ""
                                  }
                                  value={formData.lesson.data}
                                  className="mt-2"
                                  size={"small"}
                                  style={{ width: "100%" }}
                                  onChange={this.handleChangeLesson}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label=""
                                      variant="outlined"
                                      style={{ height: "40px" }}
                                      error={formData.lesson.error}
                                      helperText={formData.lesson.msj}
                                    />
                                  )}
                                />
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={6}
                              lg={6}
                              className="pt-2 pb-2 pl-2 pr-2"
                            >
                              <FormControl
                                component="fieldset"
                                className="wd-full"
                              >
                                <FormLabel component="legend">
                                  <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.CREATE.TEACHER"></FormattedMessage>
                                </FormLabel>
                                <Autocomplete
                                  options={teachers}
                                  getOptionLabel={(option) =>
                                    option.first_name
                                      ? `${option.first_name} ${option.last_name}`
                                      : ""
                                  }
                                  value={formData.teacher.data}
                                  className="mt-2"
                                  size={"small"}
                                  style={{ width: "100%" }}
                                  onChange={this.handleChangeTeacher}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label=""
                                      variant="outlined"
                                      style={{ height: "40px" }}
                                      error={formData.teacher.error}
                                      helperText={formData.teacher.msj}
                                    />
                                  )}
                                />
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              className="pt-2 pb-2 pl-2 pr-2"
                            >
                              <FormControl
                                component="fieldset"
                                className="wd-full"
                              >
                                <FormLabel component="legend">
                                  <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.CREATE.VIDEO_URL"></FormattedMessage>
                                </FormLabel>
                                <TextField
                                  label=""
                                  variant="outlined"
                                  size="small"
                                  type="text"
                                  value={formData.url.data}
                                  error={formData.url.error}
                                  helperText={formData.url.msj}
                                  onChange={this.handleChangeUrl}
                                  className={classes.textField}
                                />
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              className="pt-2 pb-2 pl-2 pr-2 text-center"
                            >
                              <Grid
                                container
                                className="justify-content-center"
                              >
                                <Grid
                                  item
                                  xs={6}
                                  sm={6}
                                  md={6}
                                  lg={6}
                                  className="mt-2 mb-2"
                                >
                                  <Button
                                    size="large"
                                    variant="contained"
                                    className="btn-primary btn-block h-35"
                                    type={"submit"}
                                  >
                                    <FormattedMessage id="GENERAL.FORM.ACTIONS.SAVE"></FormattedMessage>
                                  </Button>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </form>
                      </div>
                    </div>
                  </div>
                ) : typeFormModal === "class_data" ? (
                  <div className={`card card-custom card-stretch gutter-b`}>
                    <FCEHeader
                      title={<FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.SHOW.TITLE"></FormattedMessage>}
                      subtitle={tooltipClassData ? tooltipClassData.lesson.title : ''}
                    ></FCEHeader>
                    <div className="card-body pt-0 pb-3">
                      <div className="tab-content">
                        <List
                          component="nav"
                          aria-labelledby="nested-list-subheader"
                          className={classes.list_collapse}
                        >
                          <ListItem button onClick={this.handleClickCollapse}>
                            <ListItemText
                              primary={<FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.SHOW.MATERIALS.TITLE"></FormattedMessage>}
                              type={"one"}
                            />
                            {collapse.type_one ? (
                              <ExpandLess />
                            ) : (
                                <ExpandMore />
                              )}
                          </ListItem>
                          <Collapse
                            className="pl-5 pr-5"
                            in={collapse.type_one}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Grid container>
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                              >
                                <Table numRows={materials.body.length} title={''} subtitle={''} className="card-stretch gutter-b" data={materials} current_page={0} total={materials.body.length} onChildEdit={null} onChildFile={null} onChildCreate={null} onChildPaginationClick={null}></Table>
                              </Grid>
                            </Grid>
                          </Collapse>
                          <ListItem
                            button
                            onClick={this.handleClickCollapse}
                          >
                            <ListItemText
                              primary={<FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.SHOW.MEMOS.TITLE"></FormattedMessage>}
                              type={"two"}
                            />
                            {collapse.type_two ? (
                              <ExpandLess />
                            ) : (
                                <ExpandMore />
                              )}
                          </ListItem>
                          <Collapse
                            className="pl-2 pr-2"
                            in={collapse.type_two}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Grid container>
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                              >
                                <CollapsibleTable title={''} subtitle={''} className="card-stretch gutter-b" data={memos} onChildEdit={this.handleEditMemo}></CollapsibleTable>
                              </Grid>
                            </Grid>
                          </Collapse>
                        </List>
                      </div>
                    </div>
                  </div>
                ) : typeFormModal === "edit_class_data" ? (
                  <div className={`card card-custom card-stretch gutter-b`}>
                    <FCEHeader
                      title={<FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.TITLE"></FormattedMessage>}
                      subtitle={<FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.SUBTITLE"></FormattedMessage>}
                    ></FCEHeader>
                    <div className="card-body pt-0 pb-3">
                      <div className="tab-content">
                        <List
                          component="nav"
                          aria-labelledby="nested-list-subheader"
                          className={classes.list_collapse}
                        >
                          {
                            roles[auth.getUserInfo().user.role.name] ===
                              roles.ROLE_TEACHER ?
                              (
                                <>
                                  <ListItem button onClick={this.handleClickCollapse}>
                                    <ListItemText
                                      primary={<FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.TITLE"></FormattedMessage>}
                                      type={"one"}
                                    />
                                    {collapse.type_one ? (
                                      <ExpandLess />
                                    ) : (
                                        <ExpandMore />
                                      )}
                                  </ListItem>
                                  <Collapse
                                    className="pl-5 pr-5"
                                    in={collapse.type_one}
                                    timeout="auto"
                                    unmountOnExit
                                  >
                                    <form
                                      noValidate
                                      autoComplete="off"
                                      onSubmit={this.handleCreateMemo}
                                    >
                                      <Grid container>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          md={6}
                                          lg={6}
                                          className="pt-2 pb-2 pl-2 pr-2"
                                        >
                                          <FormControl
                                            component="fieldset"
                                            className="wd-full"
                                          >
                                            <FormLabel component="legend">
                                              <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.DATE"></FormattedMessage>
                                            </FormLabel>
                                            <TextField
                                              label=""
                                              variant="outlined"
                                              size="small"
                                              type="datetime-local"
                                              value={formData.init.data}
                                              error={formData.init.error}
                                              helperText={formData.init.msj}
                                              onChange={this.handleChangeInit}
                                              className={classes.textField}
                                              InputLabelProps={{
                                                shrink: true,
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          md={6}
                                          lg={6}
                                          className="pt-2 pb-2 pl-2 pr-2"
                                        >
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          md={6}
                                          lg={6}
                                          className="pt-2 pb-2 pl-2 pr-2"
                                        >
                                          <FormControl
                                            component="fieldset"
                                            className="wd-full"
                                          >
                                            <FormLabel component="legend">
                                              <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.STUDENT"></FormattedMessage>
                                            </FormLabel>
                                            <Autocomplete
                                              options={students}
                                              getOptionLabel={(option) =>
                                                option.name ? option.name : ""
                                              }
                                              size={"small"}
                                              value={formData.students.data.length > 0 ? formData.students.data[0] : null}
                                              onChange={this.handleChangeStudentsMemo}
                                              className="mt-2"
                                              style={{ width: "100%" }}
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  label=""
                                                  variant="outlined"
                                                  style={{ height: "40px" }}
                                                  error={formData.students.error}
                                                  helperText={formData.students.msj}
                                                />
                                              )}
                                            />
                                          </FormControl>
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          md={6}
                                          lg={6}
                                          className="pt-2 pb-2 pl-2 pr-2"
                                        >
                                          <FormControl
                                            component="fieldset"
                                            className="wd-full"
                                          >
                                            <FormLabel component="legend" className={"mb-4"}>
                                              <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.LESSON"></FormattedMessage>
                                            </FormLabel>
                                            <TextField
                                              label=""
                                              variant="outlined"
                                              size="small"
                                              value={formData.lesson.data ? formData.lesson.data.title : ""}
                                              disabled
                                            />
                                          </FormControl>
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          md={12}
                                          lg={12}
                                          className="pt-2 pb-2 pl-2 pr-2"
                                        >
                                          <FormControl
                                            component="fieldset"
                                            className="wd-full"
                                          >
                                            <FormLabel component="legend">
                                              <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.VOCABULARY_LEARNED"></FormattedMessage>
                                            </FormLabel>
                                            <TextareaAutosize
                                              aria-label="minimum height"
                                              rowsMin={3}
                                              value={formData.vocabulary_learned.data}
                                              onChange={this.handleChangeVocabularyLearned}
                                            />
                                            {
                                              formData.vocabulary_learned.error ? <span className={"text-danger-light"}>{formData.vocabulary_learned.msj}</span> : (<></>)
                                            }
                                          </FormControl>
                                        </Grid>

                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          md={12}
                                          lg={12}
                                          className="pt-2 pb-2 pl-2 pr-2"
                                        >
                                          <FormControl
                                            component="fieldset"
                                            className="wd-full"
                                          >
                                            <FormLabel component="legend">
                                              <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.SENTENCES_LEARNED"></FormattedMessage>
                                            </FormLabel>
                                            <TextareaAutosize
                                              aria-label="minimum height"
                                              rowsMin={3}
                                              value={formData.sentences_learned.data}
                                              onChange={this.handleChangeSentencesLearned}
                                            />
                                            {
                                              formData.sentences_learned.error ? <span className={"text-danger-light"}>{formData.sentences_learned.msj}</span> : (<></>)
                                            }
                                          </FormControl>
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          md={12}
                                          lg={12}
                                          className="pt-2 pb-2 pl-2 pr-2"
                                        >
                                          <FormControl
                                            component="fieldset"
                                            className="wd-full"
                                          >
                                            <FormLabel component="legend">
                                              <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.COMMENTS"></FormattedMessage>
                                            </FormLabel>
                                            <TextareaAutosize
                                              aria-label="minimum height"
                                              rowsMin={3}
                                              value={formData.comments.data}
                                              onChange={this.handleChangeComments}
                                            />
                                            {
                                              formData.comments.error ? <span className={"text-danger-light"}>{formData.comments.msj}</span> : (<></>)
                                            }
                                          </FormControl>
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={4}
                                          md={4}
                                          lg={4}
                                          className="pt-2 pb-2 pl-2 pr-2">
                                          <Button
                                            size="large"
                                            className="btn-primary btn-block h-35"
                                            type={"button"}
                                            data-type={false}
                                            data-edit={false}
                                            onClick={this.handleChangeType}
                                          >
                                            <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.ONLY_SAVE"></FormattedMessage>
                                          </Button>
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={6}
                                          md={6}
                                          lg={6}
                                          className="pt-2 pb-2 pl-2 pr-2">
                                          <Button
                                            size="large"
                                            className="btn-primary btn-block h-35"
                                            type={"button"}
                                            data-type={true}
                                            data-edit={false}
                                            onClick={this.handleChangeType}
                                          >
                                            <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.PUBLISH"></FormattedMessage>
                                          </Button>
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          md={12}
                                          lg={12}
                                          className="pt-2 pb-2 pl-2 pr-2 text-center"
                                        >
                                          <Button
                                            id={'button-submit-save-memo'}
                                            type={"submit"}
                                            style={{ display: 'none' }}
                                          ><FormattedMessage id="GENERAL.FORM.ACTIONS.SAVE"></FormattedMessage></Button>
                                        </Grid>
                                      </Grid>
                                    </form>
                                  </Collapse>
                                </>
                              ) : (<></>)
                          }
                          {roles[auth.getUserInfo().user.role.name] ===
                            roles.ROLE_ADMIN ? (
                              <>
                                <ListItem
                                  button
                                  onClick={this.handleClickCollapse}
                                >
                                  <ListItemText
                                    primary={<FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.CANCEL_CLASS.TITLE"></FormattedMessage>}
                                    type={"two"}
                                  />
                                  {collapse.type_two ? (
                                    <ExpandLess />
                                  ) : (
                                      <ExpandMore />
                                    )}
                                </ListItem>
                                <Collapse
                                  className="pl-5 pr-5"
                                  in={collapse.type_two}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <Grid container>
                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      md={12}
                                      lg={12}
                                      className="pt-2 pb-2 pl-2 pr-2"
                                    >
                                      <form
                                        noValidate
                                        autoComplete="off"
                                        onSubmit={null}
                                      >
                                        <FormControl
                                          component="fieldset"
                                          className="wd-full"
                                        >
                                          <FormLabel component="legend">
                                            <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.CANCEL_CLASS.CONFIRM"></FormattedMessage>
                                          </FormLabel>
                                          <Grid
                                            component="label"
                                            container
                                            alignItems="center"
                                            spacing={1}
                                          >
                                            <Grid item><FormattedMessage id="GENERAL.FORM.OPTIONS.NO"></FormattedMessage></Grid>
                                            <Grid item>
                                              <AntSwitch
                                                checked={stateClass}
                                                onChange={
                                                  this.handleChangeStateClass
                                                }
                                              />
                                            </Grid>
                                            <Grid item><FormattedMessage id="GENERAL.FORM.OPTIONS.YES"></FormattedMessage></Grid>
                                          </Grid>
                                        </FormControl>
                                      </form>
                                    </Grid>
                                  </Grid>
                                </Collapse>
                              </>
                            ) : (
                              <></>
                            )}
                        </List>

                      </div>
                    </div>
                  </div>
                ) : typeFormModal === "edit_memo_data" ? (
                  <form
                    noValidate
                    autoComplete="off"
                    onSubmit={this.handleSaveEditMemo}
                  >
                    <Grid container>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        lg={6}
                        className="pt-2 pb-2 pl-2 pr-2"
                      >
                        <FormControl
                          component="fieldset"
                          className="wd-full"
                        >
                          <FormLabel component="legend">
                            <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.DATE"></FormattedMessage>
                          </FormLabel>
                          <TextField
                            label=""
                            variant="outlined"
                            size="small"
                            type="datetime-local"
                            value={formData.init.data}
                            error={formData.init.error}
                            helperText={formData.init.msj}
                            onChange={this.handleChangeInit}
                            className={classes.textField}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        lg={6}
                        className="pt-2 pb-2 pl-2 pr-2"
                      >
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        lg={6}
                        className="pt-2 pb-2 pl-2 pr-2"
                      >
                        <FormControl
                          component="fieldset"
                          className="wd-full"
                        >
                          <FormLabel component="legend">
                            <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.STUDENT"></FormattedMessage>
                          </FormLabel>
                          <Autocomplete
                            options={students}
                            getOptionLabel={(option) =>
                              option.name ? option.name : ""
                            }
                            size={"small"}
                            value={formData.students.data.length > 0 ? formData.students.data[0] : null}
                            onChange={this.handleChangeStudentsMemo}
                            className="mt-2"
                            style={{ width: "100%" }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label=""
                                variant="outlined"
                                style={{ height: "40px" }}
                                error={formData.students.error}
                                helperText={formData.students.msj}
                              />
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        lg={6}
                        className="pt-2 pb-2 pl-2 pr-2"
                      >
                        <FormControl
                          component="fieldset"
                          className="wd-full"
                        >
                          <FormLabel component="legend" className={"mb-4"}>
                            <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.LESSON"></FormattedMessage>
                          </FormLabel>
                          <TextField
                            label=""
                            variant="outlined"
                            size="small"
                            value={formData.lesson.data ? formData.lesson.data.title : ""}
                            disabled
                          />
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        className="pt-2 pb-2 pl-2 pr-2"
                      >
                        <FormControl
                          component="fieldset"
                          className="wd-full"
                        >
                          <FormLabel component="legend">
                            <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.VOCABULARY_LEARNED"></FormattedMessage>
                          </FormLabel>
                          <TextareaAutosize
                            aria-label="minimum height"
                            rowsMin={3}
                            value={formData.vocabulary_learned.data}
                            onChange={this.handleChangeVocabularyLearned}
                          />
                          {
                            formData.vocabulary_learned.error ? <span className={"text-danger-light"}>{formData.vocabulary_learned.msj}</span> : (<></>)
                          }
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        className="pt-2 pb-2 pl-2 pr-2"
                      >
                        <FormControl
                          component="fieldset"
                          className="wd-full"
                        >
                          <FormLabel component="legend">
                            <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.SENTENCES_LEARNED"></FormattedMessage>
                          </FormLabel>
                          <TextareaAutosize
                            aria-label="minimum height"
                            rowsMin={3}
                            value={formData.sentences_learned.data}
                            onChange={this.handleChangeSentencesLearned}
                          />
                          {
                            formData.sentences_learned.error ? <span className={"text-danger-light"}>{formData.sentences_learned.msj}</span> : (<></>)
                          }
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        className="pt-2 pb-2 pl-2 pr-2"
                      >
                        <FormControl
                          component="fieldset"
                          className="wd-full"
                        >
                          <FormLabel component="legend">
                            <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.COMMENTS"></FormattedMessage>
                          </FormLabel>
                          <TextareaAutosize
                            aria-label="minimum height"
                            rowsMin={3}
                            value={formData.comments.data}
                            onChange={this.handleChangeComments}
                          />
                          {
                            formData.comments.error ? <span className={"text-danger-light"}>{formData.comments.msj}</span> : (<></>)
                          }
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        className="pt-2 pb-2 pl-2 pr-2">
                        <Button
                          size="large"
                          className="btn-primary btn-block h-35"
                          type={"button"}
                          data-type={false}
                          data-edit={true}
                          onClick={this.handleChangeType}
                        >
                          <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.ONLY_SAVE"></FormattedMessage>
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={6}
                        className="pt-2 pb-2 pl-2 pr-2">
                        <Button
                          size="large"
                          className="btn-primary btn-block h-35"
                          type={"button"}
                          data-type={true}
                          data-edit={true}
                          onClick={this.handleChangeType}
                        >
                          <FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.INFO_CLASS.EDIT.MEMOS.PUBLISH"></FormattedMessage>
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        className="pt-2 pb-2 pl-2 pr-2 text-center"
                      >
                        <Button
                          id={'button-submit-edit-memo'}
                          type={"submit"}
                          style={{ display: 'none' }}
                        ><FormattedMessage id="GENERAL.FORM.ACTIONS.SAVE"></FormattedMessage></Button>
                      </Grid>
                    </Grid>
                  </form>
                ) :
                        (
                          <></>
                        )
                }
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <div className={"mt-2"}>
                  <p style={{ textAlign: "right" }}>
                    <Button
                      size={"large"}
                      className={`btn btn-primary`}
                      variant="contained"
                      onClick={this.handleCloseModal}
                    >
                      <FormattedMessage id="GENERAL.FORM.ACTIONS.CLOSE"></FormattedMessage>
                    </Button>
                  </p>
                </div>
              </Grid>
            </Grid>
          </div>
        </Modal>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={snackbar.status}
          autoHideDuration={10000}
          onClose={this.handleCloseSnackbar}
        >
          <Alert onClose={this.handleCloseSnackbar} severity={snackbar.code}>
            {snackbar.message}
          </Alert>
        </Snackbar>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <div className={`card card-custom card-stretch gutter-b p-0`}>
              {roles[auth.getUserInfo().user.role.name] ===
                roles.ROLE_ADMIN ? (
                  <div className={"bg-light text-right"}>
                    <button className={"btn btn-primary m-4"} onClick={this.handleAddClass}>
                      <AddIcon />
                      <span className={"pl-2"}>Crear clase</span>
                    </button>
                  </div>
                ) :
                (<></>)
              }
              <Paper>
                <Scheduler
                  locale={selectedLang === 'en' ? "en-US" : "es-CO"}
                  data={filterTasks(data, currentPriority)}
                  height={660}
                >
                  <ViewState
                    currentDate={currentDate}
                    currentViewName={currentViewName}
                    onCurrentViewNameChange={this.currentViewNameChange}
                    onCurrentDateChange={this.currentDateChange}
                  />

                  <GroupingState grouping={grouping} />

                  <WeekView
                    startDayHour={0}
                    endDayHour={24}
                    excludedDays={[]}
                    name="Semana"
                    timeTableCellComponent={WeekViewTimeTableCell}
                    dayScaleCellComponent={WeekViewDayScaleCell}
                  />

                  <Appointments appointmentComponent={Appointment} />
                  <Resources data={resources} />
                  <IntegratedGrouping />

                  <GroupingPanel cellComponent={GroupingPanelCell} />
                  <Toolbar flexibleSpaceComponent={this.flexibleSpace} />
                  <DateNavigator />
                  <AppointmentTooltip
                    onOpenButtonClick={this.handleOpenModal}
                    contentComponent={TooltipContent}
                    headerComponent={Header}
                    showCloseButton={true}
                  />

                  <button
                    id={"button-show-detail-class"}
                    style={{ display: "none" }}
                    onClick={this.handleShowClassData}
                  ></button>
                  <button
                    id={"button-edit-class"}
                    style={{ display: "none" }}
                    onClick={this.handleEditClassData}
                  ></button>
                  <button
                    id={"button-edit-memo"}
                    style={{ display: "none" }}
                    onClick={this.handleEditMemoData}
                  ></button>
                  <button
                    id={"button-make-notification-missing-student"}
                    style={{ display: "none" }}
                    onClick={this.handleCreateNotification}
                  ></button>

                  {roles[auth.getUserInfo().user.role.name] ===
                    roles.ROLE_ADMIN ? (
                      <Fab
                        color="secondary"
                        className={classes.addButton}
                        style={{ zIndex: 10 }}
                        onClick={this.handleAddClass}
                      >
                        <AddIcon />
                      </Fab>
                    ) :
                    (<></>)
                  }
                </Scheduler>
              </Paper>
            </div>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default withStyles(styles, { name: "Calendar" })(Calendar);
