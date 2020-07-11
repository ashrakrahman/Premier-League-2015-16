import * as React from "react";
import { Row, Col, Button, Table } from "reactstrap";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import _ from "lodash";
import Modal from "react-bootstrap/Modal";

export interface OperatorListProps {}

export interface OperatorListState {
  data: any;
  show: boolean;
  selectedTeam: any | null;
  teamInfo: any;
}

class OperatorList extends React.Component<
  OperatorListProps,
  OperatorListState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: [],
      show: false,
      selectedTeam: null,
      teamInfo: null
    };
  }

  private handleTeamInfo = (event: any) => {
    const teamId = event.target.id.toString().split("_")[1];
    this.handleShow();
    this.setState({ selectedTeam: teamId });
  };

  public handleShow = () => {
    this.setState({ show: true });
  };

  public handleClose = () => {
    this.setState({ show: false, selectedTeam: null });
  };

  private assignTeamInfo = (teamInfoList: any, element: any, name: any) => {
    teamInfoList.push({
      key: element,
      name: name,
      played: 1,
      win: 0,
      lose: 0,
      draw: 0
    });
  };

  private updateTeamInfo = (
    index: number,
    teamInfoList: any,
    element: any,
    name: any
  ) => {
    let temp = teamInfoList[index];
    teamInfoList[index] = {
      key: element,
      name: name,
      played: temp.played + 1,
      win: 0,
      lose: 0,
      draw: 0
    };
  };

  public async componentDidMount() {
    await axios
      .get(
        "https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json",
        {
          headers: {}
        }
      )
      .then(response => {
        this.setState({ data: response.data.rounds || [] });
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response);
        }
      });
  }

  render() {
    const matchDayList: any = this.state.data;
    const matchList: any = [];
    const muiMatchList: any = [];
    const teamList: any = [];
    let teamInfoList: any = [];

    // Get all Match list from match day list
    for (let i = 0; i < matchDayList.length; i++) {
      matchDayList[i].matches.forEach((element: any) => {
        matchList.push(element);
      });
    }

    // Get all team list and mui datatable list from match list
    matchList.forEach((element: any) => {
      let arr: any = [];
      let score: any;
      let info: any;
      arr.push(element.date);
      score = element.score1 + " - " + element.score2;
      info = {
        team1: element.team1.name,
        teamKey1: element.team1.key,
        team2: element.team2.name,
        teamKey2: element.team2.key
      };
      teamList.push(info);
      arr.push(score);
      muiMatchList.push(arr);

      if (teamInfoList.some((item: any) => item.key === element.team1.key)) {
        const index = _.findIndex(teamInfoList, function (teamInfo: any) {
          return teamInfo.key === element.team1.key;
        });
        this.updateTeamInfo(
          index,
          teamInfoList,
          element.team1.key,
          element.team1.name
        );
      } else {
        this.assignTeamInfo(
          teamInfoList,
          element.team1.key,
          element.team1.name
        );
      }

      if (teamInfoList.some((item: any) => item.key === element.team2.key)) {
        const index = _.findIndex(teamInfoList, function (teamInfo: any) {
          return teamInfo.key === element.team2.key;
        });
        this.updateTeamInfo(
          index,
          teamInfoList,
          element.team2.key,
          element.team2.name
        );
      } else {
        this.assignTeamInfo(
          teamInfoList,
          element.team2.key,
          element.team2.name
        );
      }
    });

    matchList.forEach((element: any) => {
      if (element.score1 > element.score2) {
        const indexWinningTeam = _.findIndex(teamInfoList, {
          key: element.team1.key
        });
        teamInfoList[indexWinningTeam].win =
          teamInfoList[indexWinningTeam].win + 1;
        const indexLosingTeam = _.findIndex(teamInfoList, {
          key: element.team2.key
        });
        teamInfoList[indexLosingTeam].lose =
          teamInfoList[indexLosingTeam].lose + 1;
      } else if (element.score1 < element.score2) {
        const indexWinningTeam = _.findIndex(teamInfoList, {
          key: element.team2.key
        });
        teamInfoList[indexWinningTeam].win =
          teamInfoList[indexWinningTeam].win + 1;
        const indexLosingTeam = _.findIndex(teamInfoList, {
          key: element.team1.key
        });
        teamInfoList[indexLosingTeam].lose =
          teamInfoList[indexLosingTeam].lose + 1;
      } else {
        const indexDrawTeam1 = _.findIndex(teamInfoList, {
          key: element.team1.key
        });
        const indexDrawTeam2 = _.findIndex(teamInfoList, {
          key: element.team2.key
        });
        teamInfoList[indexDrawTeam1].draw =
          teamInfoList[indexDrawTeam1].draw + 1;
        teamInfoList[indexDrawTeam2].draw =
          teamInfoList[indexDrawTeam2].draw + 1;
      }
    });

    const columns = [
      "Date",
      {
        name: "Assign",
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRenderLite: (dataIndex: any, rowIndex: any) => {
            return (
              <div>
                <Button
                  outline
                  size="sm"
                  id={rowIndex + "_" + teamList[rowIndex].teamKey1}
                  onClick={this.handleTeamInfo}
                >
                  {teamList[rowIndex].team1}
                </Button>{" "}
                <Button color="secondary" size="sm">
                  vs
                </Button>{" "}
                <Button
                  outline
                  size="sm"
                  id={rowIndex + "_" + teamList[rowIndex].teamKey2}
                  onClick={this.handleTeamInfo}
                >
                  {teamList[rowIndex].team2}
                </Button>
              </div>
            );
          }
        }
      },
      "Score"
    ];

    if (teamInfoList.length > 0 && this.state.teamInfo === null) {
      this.setState({ teamInfo: teamInfoList });
    }

    let seletedTeamInfo = [];
    if (this.state.selectedTeam) {
      const index = _.findIndex(teamInfoList, {
        key: this.state.selectedTeam
      });
      seletedTeamInfo = teamInfoList[index];
    }

    //console.log(seletedTeamInfo);

    return (
      <Row style={{ marginBottom: "150px" }}>
        <Col sm={{ size: 8, order: 2, offset: 2 }}>
          <br></br>
          <MUIDataTable
            title={"Match List Table"}
            data={muiMatchList}
            columns={columns}
            options={{
              selectableRows: "none"
            }}
          />

          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                <strong> {seletedTeamInfo.name} </strong>{" "}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {" "}
              <Table bordered>
                <thead>
                  <tr>
                    <th>Played</th>
                    <th>Win</th>
                    <th>Lose</th>
                    <th>Draw</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">{seletedTeamInfo.played}</th>
                    <td>{seletedTeamInfo.win}</td>
                    <td>{seletedTeamInfo.lose}</td>
                    <td>{seletedTeamInfo.draw}</td>
                  </tr>
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button color="secondary" onClick={this.handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    );
  }
}

export default OperatorList;
