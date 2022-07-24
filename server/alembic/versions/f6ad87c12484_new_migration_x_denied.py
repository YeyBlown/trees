"""New Migration x denied

Revision ID: f6ad87c12484
Revises: 890c6d9ae933
Create Date: 2022-06-14 06:11:04.390384

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f6ad87c12484'
down_revision = '890c6d9ae933'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('post', 'x')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('post', sa.Column('x', sa.INTEGER(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###