class ChatController {
  async newChat(req, res) {
    try {
      const { login } = req.body;
      if (!login) {
        res.status(400).json({ message: NOT_FOUND_LOGIN_EXCEPTION });
      } else {
        const pool = getDBConn();
        pool.getConnection((err, conn) => {
          if (err) {
            res.status(501).json(err);
          } else {
            pool.query(getUserByLoginRequest(login), (reqError, records) => {
              if (reqError != null) {
                res.status(501).json(reqError);
              } else if (records[0]) {
                res.json({ isExist: true });
              } else {
                res.json({ isExist: false });
              }
            });
          }
        });
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

export default ChatController;
