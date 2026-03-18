from unittest.mock import MagicMock, patch
from app.core import database

def test_database_functions_coverage():
    # 1. Testando o create_db_and_tables (Simulando o engine e a session)
    with patch("app.core.database.engine") as mock_engine:
        with patch("app.core.database.Session") as mock_session_cls:
            mock_session = MagicMock()
            mock_session_cls.return_value.__enter__.return_value = mock_session
            
            # Chama a função original do seu database.py
            database.create_db_and_tables()
            
            # Verifica se o SQL de criar schema foi "executado"
            assert mock_session.execute.called
            assert mock_session.commit.called

    # 2. Testando o get_session (Generator)
    with patch("app.core.database.Session") as mock_session_cls:
        gen = database.get_session()
        next(gen) # Inicia o generator
        assert mock_session_cls.called