import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchGames } from "../state/game/gameSlice";
import { Text, Grid, Button, Spacer, Card, Row, Pagination, Divider, Table} from "@nextui-org/react";
import { Chessboard } from "react-chessboard";
import { Link, NavLink } from "react-router-dom";
import GameListItem from "./GameListItem";
import { truncateAddress, formatDate, getTokenNameFromAddress } from "../ether/utils";
import { playerIsInGame, getGameById } from "../state/game/gameHelper";
import { ethers } from "ethers";


export default () => {
    const games = useSelector(state => state.game.games);
    const accounts = useSelector(state => state.auth.accounts);
    var address = Array.isArray(accounts) && accounts.length > 0 ? accounts[0] : ""
    const dispatch = useDispatch()

    const columns = [
        {
          key: "id",
          label: "ID",
        },
        {
          key: "players",
          label: "PLAYERS",
        },
        {
            key: "wagerAmount",
            label: "WAGER"
        },
        {
          key: "mode",
          label: "MODE",
        },
        {
            key: "created",
            label: "CREATED",
        },
        {
            key: "join",
            label: "",
        }
    ];

    const rows = Object.values(games).map((game, index) => {
        var p1 = game.players[0] ?? "not joined"
        var p2 = game.players[1] ?? "not joined"
        var players = truncateAddress(p1) + " vs " + truncateAddress(p2)
        var date  = new Date(game.timestamp )
        var wagerAmount = game.wagerAmount.toString()
        return {
            key: index,
            id: game.id,
            pgn: game.pgn,
            players,
            wagerAmount: wagerAmount + " " + getTokenNameFromAddress(game.token),
            mode: game.isBot ? "Bot": "Human",
            created: formatDate(date)
        }
    })

    const joinButton = (gameId) => {
        const isAlreadyInGame = playerIsInGame(games, address, gameId)
        const isGameOver = getGameById(games, gameId).isEnd
        
        var buttonText = "join"
        if(isAlreadyInGame) buttonText = "back in game"
        if(isGameOver) buttonText = "view history"
        return <Link to={"game/" + gameId}>{buttonText}</Link>
    }

    return (
        <div className="gameListItem">
            <Card shadow={true} css={{ height:"700px", width: "1000px", paddingLeft:"50px", paddingRight:"50px", paddingTop:"50px"}}>
                <Card.Header>
                    <Row justify="center">
                        <Text>Open games</Text>
                    </Row>
                </Card.Header>
                <Table
                        aria-label="Example table with dynamic content"
                        css={{
                            height: "auto",
                            minWidth: "100%",
                            overflow: "hidden"
                        }}
                        shadow={false}
                >
                    <Table.Header columns={columns}>
                        {(column) => (
                            <Table.Column key={column.key}>{column.label}</Table.Column>
                        )}
                    </Table.Header>
                    <Table.Body items={rows}>
                        {(item) => (
                            <Table.Row key={item.key}>
                                {(columnKey) => 
                                    <Table.Cell>{
                                        columnKey == "join" ? 
                                              joinButton(item.id): 
                                            item[columnKey]}
                                    </Table.Cell>
                                }
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </Card>
            
        </div> 
    );
}