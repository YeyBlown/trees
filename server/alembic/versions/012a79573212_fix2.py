"""fix2

Revision ID: 012a79573212
Revises: e3b96fda529b
Create Date: 2022-07-18 14:04:18.053969

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '012a79573212'
down_revision = 'e3b96fda529b'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('name', sa.String(), nullable=False))
    op.add_column('user', sa.Column('surname', sa.String(), nullable=False))
    op.add_column('user', sa.Column('description', sa.String(), nullable=True))
    op.add_column('user', sa.Column('age', sa.Integer(), nullable=False))
    op.alter_column('user', 'username',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('user', 'hashed_password',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.create_unique_constraint(None, 'user', ['username'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'user', type_='unique')
    op.alter_column('user', 'hashed_password',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('user', 'username',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.drop_column('user', 'age')
    op.drop_column('user', 'description')
    op.drop_column('user', 'surname')
    op.drop_column('user', 'name')
    # ### end Alembic commands ###
