class ChessGame{

  constructor(type = "normal", time = "-1"){

    this.type = type;
    this.turns = new Array();
    this.time = time;
    this.domBoard = document.getElementById("c-board");
    this.board = new ChessBoard();
    this.PIECES = Object.freeze({"BLACK_ROOK":"black_rook", "BLACK_KNIGHT":"black_knight", "BLACK_BISHOP":"black_bishop", "BLACK_QUEEN":"black_queen", "BLACK_KING":"black_king", "BLACK_PAWN":"black_pawn", "WHITE_ROOK":"white_rook", "WHITE_KNIGHT":"white_knight", "WHITE_BISHOP":"white_bishop", "WHITE_QUEEN":"white_queen", "WHITE_KING":"white_king", "WHITE_PAWN":"white_pawn"});

    this.playersTurn = "white";

  }

  movePiece(mov){

    let piece = this.getPiece(mov.pos1.x, mov.pos1.y);

    if(this.getColorFromPiece(piece) !== this.playersTurn || this.piece == 0)
      return;

    let possibleMoves = this.getPossibleMoves(mov.pos1);

    for(let i = 0; i < possibleMoves.length; i++){

      if(possibleMoves[i].y == mov.pos2.y && possibleMoves[i].x == mov.pos2.x){

        if(possibleMoves[i].type != "undefined"){

          switch(possibleMoves[i].type){

            case "en_passant" :
              this.setPiece(new Position(possibleMoves[i].rem_x, possibleMoves[i].rem_y), 0);
              break;
            case "castling" :
              break;

          }

        }

        this.setPiece(mov.pos2, this.getPiece(mov.pos1.x, mov.pos1.y));
        this.setPiece(mov.pos1, 0);

        this.board.updatePieces();

        this.turns.push(mov);

        if(this.playersTurn == "white"){
          this.playersTurn = "black";
        }else{
          this.playersTurn = "white";
        }

        break;

      }

    }

  }

  getAttackedFields(color = "white"){

    let attacked_fields = new Set(), x, y, i;

    for(let field_x = 0; field_x < 8; field_x++){

      for(let field_y = 0; field_y < 8; field_y++){

        if(this.getPieceType(this.getPiece(field_x, field_y)) == "queen"){
          /*BISHOP*/
          x = field_x;
          y = field_y;

          while(x < 8 && y < 8){
            y++;
            x++;

            if(this.isPossiblePosition(x, y)){
              attacked_fields.add(new Position(x, y));
            }else{
              break;
            }

          }

          x = field_x;
          y = field_y;

          while(x >= 0 && y < 8){
            y++;
            x--;
            if(this.isPossiblePosition(x, y)){
              attacked_fields.add(new Position(x, y));
            }else{
              break;
            }
          }

          x = field_x;
          y = field_y;

          while( x < 8 && y >= 0){
            y--;
            x++;
            if(this.isPossiblePosition(x, y)){
              attacked_fields.add(new Position(x, y));
            }else{
              break;
            }
          }

          x = field_x;
          y = field_y;

          while(x >= 0 && y >= 0){
            y--;
            x--;
            if(this.isPossiblePosition(x, y)){
              attacked_fields.add(new Position(x, y));
            }else{
              break;
            }
          }

          /*ROOK*/
          /*Standard moves and Capturing*/
          for(i = field_x + 1; i < 8; i++){
            if(this.isPossiblePosition(i, field_y)){
              attacked_fields.add(new Position(i, field_y));
            }else{
              break;
            }
          }

          for(i = field_x - 1; i >= 0; i--){
            if(this.isPossiblePosition(i, field_y)){
              attacked_fields.add(new Position(i, field_y));
            }else{
              break;
            }
          }

          for(i = field_y + 1; i < 8; i++){
            if(this.isPossiblePosition(field_x, i)){
              attacked_fields.add(new Position(field_x, i));
            }else{
              break;
            }
          }

          for(i = field_y - 1; i >= 0; i--){
            if(this.isPossiblePosition(field_x, i)){
              attacked_fields.add(new Position(field_x, i));
            }else{
              break;
            }
          }
        }
      }
    }

    return attacked_fields;

  }
  getColorFromPiece(piece){

    if(typeof piece !== "string")
      return "";

    return piece.match(/[^_]+/i)[0];

  }
  getPieceType(piece){

    if(typeof piece !== "string")
      return "";

    return piece.replace(/[^_]+_/i, "");

  }
  getPiece(x, y){

    if(this.isPossiblePosition(x, y))
      return this.board.field[y][x];

    return 0;

  }
  setPiece(pos, piece){
    this.board.field[pos.y][pos.x] = piece;
  }
  isPossiblePosition(x, y){

    if(x >= 0 && x < 8 && y >= 0 && y < 8)
      return true;

    return false;

  }
  isThreatenedField(x, y, color){

    if(!this.isPossiblePosition(x, y))
      return true;

    let attacked_fields = this.getAttackedFields(color).entries();
    
    for(let item of attacked_fields){

      if(item[0].x == x && item[0].y == y)
        return true;

    }

    return false;

  }

}
