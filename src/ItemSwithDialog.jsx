import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Draggable from "react-draggable";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const groupList = {
  line: { name: "折线图", options: [{ id: "basicLine", name: "基础这线图" }] },
  bar: { name: "柱状图", options: [] },
  pie: { name: "饼图", options: [] },
};

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function ItemSwitchDialog() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [group, setGroup] = React.useState("");
  const [option, setOption] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let options = "";

  const handleGroupChange = (event) => {
    let value = event.target.value;
    setGroup(value);
    options = groupList[value].options.map((option) => {
      return <option value={option.id}>{option.name}</option>;
    });
  };

  const handleChange = () => {};

  const groups = Object.keys(groupList).map((group) => {
    return <option value={group}>{groupList[group].name}</option>;
  });

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          请选择需要的图表
        </DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="demo-dialog-native">表格类型</InputLabel>
              <Select
                native
                value={group}
                onChange={handleGroupChange}
                input={<Input id="demo-dialog-native" />}
              >
                <option aria-label="None" value="" />
                {groups}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-dialog-select-label">模板</InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={option}
                onChange={handleChange}
                input={<Input />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {options}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            取消
          </Button>
          <Button onClick={handleClose} color="primary">
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
